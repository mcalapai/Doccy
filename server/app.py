# flask imports
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

# py imports
import langchain.vectorstores
import pandas as pd
import os
import json
import numpy as np
import pickle
from datetime import datetime
import requests

from utils import QDrantClient
import utils
from supabase import create_client, Client
import io
import pickle

# app instance
app = Flask(__name__)
#CORS(app)

global qdrant_object


@app.route('/api/guest/query', methods=['POST'])
def handle_guest_query():
    gpt_query = request.form.get('query')
    files = request.files.to_dict()
    collection = request.form.get('collection')
    new_chat = request.form.get('new_chat')
    print("new chat: " + new_chat)

    files_content = [files[file] for file in files]

    # create collection from files
    # then run query on new collection
    if new_chat == "true":
        print("New Chat")
        qdrant_object.create_vector_store(files_content, collection)
        qdrant_object.set_collection(collection)

    response = qdrant_object.handle_user_input(gpt_query)
    json_response = jsonify({"status": "success", "chat_history": response})
    json_response.headers.add('Access-Control-Allow-Origin', '*')
    return json_response
    # run query from collection name


@app.route('/api/user/query', methods=['POST'])
def handle_user_query():
    global qdrant_object
    
    gpt_query = request.form.get('query')
    user_token = request.form.get('access_token')
    files = request.files.to_dict()
    collection = request.form.get('collection')
    files_content = [files[file] for file in files]

    if qdrant_object.collection == "":
        qdrant_object.set_collection(collection)

    if files:
        # create collection from files
        # then run query on new collection
        qdrant_object.create_vector_store(files_content, collection)
        response = qdrant_object.handle_user_input(gpt_query)
    else:
        response = qdrant_object.handle_user_input(gpt_query)

    chat_title = qdrant_object.generate_chat_title(gpt_query)

    response = jsonify({"status": "success", "chat_history": response, "chat_title": chat_title})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/api/get-collections', methods=['GET'])
def handle_get_collections():
    global qdrant_object

    user_token = request.form.get('access_token')

    qdrant_object = QDrantClient()
    supabase_client = create_client(supabase_url, supabase_key)

    collections = qdrant_object.get_existing_collections()
    
    response = jsonify({"collections": collections})
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response

@app.route('/api/user/save-chat', methods=['POST'])
def handle_save_chat():
    global qdrant_object

    chat_title = request.form.get('chat_title')
    user_id = request.form.get('user_id')  # how to do this?
    file_id = request.form.get('file_id')  # generate file uuid
    file = qdrant_object.get_conversation_memory()
    pickled_file = pickle.dumps(file)
    file_name = f"{file_id}.pkl"
    access_token = request.form.get('access_token')
    file_path = f"chats/{user_id}/{file_name}"

    data = {"id": file_id, "title": chat_title, "file_path": file_path, "created_at": datetime.utcnow().isoformat(), "user_id": user_id}

    headers = {
        "Authorization": f"Bearer {access_token}",
        "apikey": supabase_key,  # Replace with your Supabase API key
        "Content-Type": "application/json"
    }

    endpoint = supabase_url + "/rest/v1/chats"

    # check if folder exists/create folder
    if not utils.check_bucket_folder_exists(supabase_client, "chats", f"{user_id}"):
        utils.create_bucket_folder(supabase_client, "chats", f"{user_id}")

    # check if file exists for chat session - if it does, delete and overwrite
    save_res = utils.save_chat_to_file(supabase_client, bucket_name="chats", folder_name=f"{user_id}", 
                            file_name=file_name, pickled_file=pickled_file)
    
    if not utils.check_table_entry_exists(supabase_client, file_id=file_id):
        insert_res = requests.post(endpoint, json=[data], headers=headers)
        print("Insert Res: ", insert_res.text)

    response = jsonify({"status": "success"})
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response

@app.route('/api/user/load-saved-chat', methods=['POST'])
def handle_load_saved_chat():
    global qdrant_object

    file_path = request.form.get('file_path')
    file_path = file_path.replace("chats/", "")
    access_token = request.form.get('access_token')

    stream = io.BytesIO()

    res = supabase_client.storage.from_("chats").download(file_path)
    stream.write(res)
    stream.seek(0)

    ## load pickle file from stream
    pickled_file = stream.getvalue()
    file = pickle.loads(pickled_file)

    ## create new qdrant object
    qdrant_object = QDrantClient()

    ## set collection?

    ## set conversation memory
    chat_history = qdrant_object.set_conversation_memory(file)

    response = jsonify({"chat_history": chat_history})
    response.headers.add('Access-Control-Allow-Origin', '*')

    print(chat_history)

    return response


if __name__ == '__main__':
    supabase_url = os.environ.get('SUPABASE_URL')
    supabase_key = os.environ.get('SUPABASE_KEY')

    supabase_client = create_client(supabase_url, supabase_key)
    
    app.run(debug=True)
