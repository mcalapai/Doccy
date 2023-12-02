# flask imports
from flask import Flask, jsonify, request
from flask_cors import CORS

# py imports
import pandas as pd
import os
import json
import numpy as np

from utils import QDrantClient

# app instance
app = Flask(__name__)
CORS(app)


@app.route('/api/query', methods=['POST'])
def handle_query():
    data = request.json
    gpt_query = data['query']

    chat_history = qdrant_object.handle_user_input(gpt_query)

    if chat_history:
        return jsonify({"status": "success", "chat_history": chat_history})
    else:
        return jsonify({"status": "failure", "received_data": data})


@app.route('/api/get-collections', methods=['GET'])
def handle_get_collections():
    collections = qdrant_object.get_existing_collections()
    print(collections)

    return jsonify({"collections": collections})


@app.route('/api/set-collection', methods=['POST'])
def handle_set_collection():
    data = request.json
    print("Data: ", data)
    collection = data['collection']
    qdrant_object.set_collection(collection)

    return jsonify({"message": "Data received", "received_data": data})


@app.route('/api/upload', methods=['POST'])
def handle_upload():
    print("Upload route")
    collection_name = request.form.get('name')
    print("Collection name: ", collection_name)
    file = request.files.get('file')

    if not file:
        return jsonify({"message": "No file uploaded"}), 400
    if file.filename == '':
        return jsonify({"message": "No file selected"}), 400

    # create vector store
    qdrant_object.create_vector_store(file, collection_name)

    return jsonify({"message": "File uploaded and processed successfully"})


if __name__ == '__main__':
    qdrant_object = QDrantClient()
    app.run(debug=True)
