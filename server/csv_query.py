import dotenv
import pandas as pd
import openai
import qdrant_client
from qdrant_client import QdrantClient
from langchain.llms import OpenAI
from dotenv import load_dotenv
import os

# import data
df = pd.read_csv('data/Batch2.csv')

# combine into one string
df['combined'] = df.apply(lambda row: ' '.join(row.astype(str)), axis=1)

# openai and langchain setup
openai.api_key = os.getenv('OPENAI_API_KEY')
llm = OpenAI()

# generate embeddings for each row
embeddings = [llm.embed(text) for text in df['combined']]

# create qdrant client
client = QdrantClient(host="localhost", port=6333)
collection_name = "test_collection"

client.recreate_collection(collection_name=collection_name, vector_size=len(embeddings[0]), distance='Cosine')

# upload to qdrant

for i, emb in enumerate(embeddings):
    