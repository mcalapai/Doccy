import os
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import qdrant
import qdrant_client

from qdrant_client.http.models import models
from langchain.vectorstores import Qdrant
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain

load_dotenv()


class QDrantClient():
    def __init__(self):
        # create qdrant client
        self.client = qdrant_client.QdrantClient(
            os.getenv('QDRANT_HOST'),
            api_key=os.getenv('QDRANT_API_KEY')
        )
        self.embeddings = OpenAIEmbeddings()
        self.conversation = None
        self.chat_history = ""
        self.collection = ""
        self.memory = None

    def get_pdf_text(self, pdf_docs):
        text = ""
        # for pdf in pdf_docs:
        for pdf in pdf_docs:
            pdf_reader = PdfReader(pdf)
            for page in pdf_reader.pages:
                text += page.extract_text()
        return text

    def get_text_chunks(self, raw_text: str) -> str:
        text_splitter = CharacterTextSplitter(
            separator="\n",
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        chunks = text_splitter.split_text(raw_text)

        return chunks

    def create_collection(self, collection_name):
        vectors_config = models.VectorParams(
            size=1536, distance=models.Distance.COSINE)

        self.client.recreate_collection(
            collection_name=collection_name, vectors_config=vectors_config)

    def get_conversation_chain(self, vector_store):
        llm = ChatOpenAI(model_name="gpt-4")

        self.memory = ConversationBufferMemory(
            memory_key='chat_history', return_messages=True)

        conversation_chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=vector_store.as_retriever(),
            memory=self.memory,
        )

        self.conversation = conversation_chain
        return conversation_chain

    def handle_user_input(self, user_query):
        response = self.conversation(
            {'question': user_query, "chat_history": self.chat_history})
        self.chat_history = response['chat_history']

        return response['answer']
    
    def generate_chat_title(self, initial_query):
        prompt = "Generate a short, concise title for the following query based on the context provided. The title should only be a few words long (5 words MAXIMUM). It is a title providing context to the query/chat. Return the title as pure plain text that contains only the title. The content is as follows:"
        response = self.conversation(
            {'question': prompt + "\n" + initial_query, "chat_history": self.chat_history})
        response = str(response['answer']).replace('"', "").strip()
        
        print("Chat title: ", response)

        return response


    def get_existing_collections(self):
        collections = self.client.get_collections().collections
        collections = [text.name for text in collections]
        return collections

    def set_collection(self, collection):
        print("Collection: ", collection)
        self.collection = collection

        current_vector_store = Qdrant(
            client=self.client,
            collection_name=collection,
            embeddings=self.embeddings
        )

        # create conversation chain
        self.conversation = self.get_conversation_chain(
            current_vector_store)

    def create_vector_store(self, files, collection_name):
        # get pdf text
        raw_text = self.get_pdf_text(files)

        # get text chunks
        text_chunks = self.get_text_chunks(raw_text)
        self.create_collection(collection_name)

        # create vector store
        vector_store = Qdrant(
            client=self.client,
            collection_name=collection_name,
            embeddings=self.embeddings
        )

        # add documents to vector store
        vector_store.add_texts(text_chunks)

        print("Created vector store")

    def get_conversation_memory(self):
        return self.conversation.memory
    
    def set_conversation_memory(self, picked_file):
        llm = ChatOpenAI(model_name="gpt-4")

        current_vector_store = Qdrant(
            client=self.client,
            collection_name="MCWorkDetails",
            embeddings=self.embeddings
        )

        self.conversation = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=current_vector_store.as_retriever(),
            memory=picked_file,
        )

        convo_memory = self.conversation.memory.dict()['chat_memory']['messages']
        chat_history = [item['content'] for item in convo_memory]
        self.chat_history = chat_history

        return chat_history


def check_bucket_folder_exists(supabase_client, bucket_name, folder_name):
    if not folder_name.endswith("/"):
        folder_name += "/"

    response = supabase_client.storage.from_(bucket_name).list(folder_name)
    if response and len(response) > 0:
        return True
    return False

def check_table_entry_exists(supabase_client, file_id):
    response = supabase_client.table('chats').select("*").execute()
    if any(data['file_path'] == file_id for data in response.data):
        return True

def save_chat_to_file(supabase_client, bucket_name, folder_name, file_name, pickled_file):
    if not folder_name.endswith("/"):
        folder_name += "/"

    files = supabase_client.storage.from_(bucket_name).list(folder_name)
    file_exists = any(file['name'] == file_name for file in files)

    file_path = f"{folder_name}{file_name}"

    if file_exists:
        delete_response = supabase_client.storage.from_(bucket_name).remove([file_path])
    
    response = supabase_client.storage.from_(
        "chats").upload(file=pickled_file, path=file_path, file_options={"content-type": "application/octet-stream"})
    
    return response

def create_bucket_folder(supabase_client, bucket_name, folder_name):
    if not folder_name.endswith("/"):
        folder_name += "/"

    response = supabase_client.storage.from_(
        bucket_name).upload(path=folder_name + '.placeholder', file=b'', file_options={"content-type":'application/octet-stream'})
    #if response.get("error") is None:
        #return True
    #return False
    print("Upload response: ", response)
