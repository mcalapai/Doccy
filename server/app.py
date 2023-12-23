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

from utils import QDrantClient
import utils
from supabase import create_client, Client

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
    file_names = [file.filename for file in files_content]

    print("Conversation:", qdrant_object.conversation)
    print("Chat:", qdrant_object.chat_history)

    if qdrant_object.collection == "":
        qdrant_object.set_collection(collection)

    if files:
        # create collection from files
        # then run query on new collection
        qdrant_object.create_vector_store(files_content, collection)
        response = qdrant_object.handle_user_input(gpt_query)

        response = jsonify({"status": "success", "chat_history": response})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    else:
        print("Query from existing collection ", collection)

        response = qdrant_object.handle_user_input(gpt_query)

        response = jsonify({"status": "success", "chat_history": response})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response


@app.route('/api/get-collections', methods=['GET'])
def handle_get_collections():
    global qdrant_object
    qdrant_object = QDrantClient()
    collections = qdrant_object.get_existing_collections()
    
    response = jsonify({"collections": collections})
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response


@app.route('/api/user/save-chat', methods=['POST'])
def handle_save_chat():
    global qdrant_object
    print("break 1")
    chat_title = request.form.get('title')
    user_id = request.form.get('user_id')  # how to do this?
    file_id = request.form.get('file_id')  # generate file uuid
    file = qdrant_object.get_conversation_memory()
    pickled_file = pickle.dumps(file)
    file_name = f"{file_id}.pkl"

    # check if folder exists/create folder
    bucket_exists = utils.check_bucket_folder_exists(supabase_client, "chats", f"/{user_id}")
    if not bucket_exists:
        print("------------------------")
        print("Folder already exists")
        print("------------------------")
        utils.create_bucket_folder(supabase_client, "chats", f"/{user_id}")

    # upload .pkl file to bucket
    full_path = f"{user_id}/{file_name}"
    response = supabase_client.storage.from_(
        "chats").upload(file=pickled_file, path=full_path, file_options={"content-type": "application/octet-stream"})
    # Check if the upload was successful
    print("Total response: ", response)
    #if response.get('error') is None:
    #    print("Upload successful")
    #else:
    #    print("Error:", response.get('error'))

    # insert table entry
    # data, count = supabase_client.table('chats').insert(
    #    {"id": file, "title": chat_title, "file_id": file_id, "created_at": datetime.now(), "user_id": user_id}).execute()
    response = jsonify({"status": "success"})
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response


if __name__ == '__main__':
    supabase_url = os.environ.get('SUPABASE_URL')
    supabase_key = os.environ.get('SUPABASE_KEY')
    
    supabase_client: Client = create_client(supabase_url, supabase_key)
    app.run(debug=True)
