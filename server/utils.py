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
        pdf_reader = PdfReader(pdf_docs)
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
        print("Conversation:")
        print(self.conversation)

        response = self.conversation(
            {'question': user_query, "chat_history": self.chat_history})
        self.chat_history = response['chat_history']

        print(response)

        # raise Exception("Error")

        return response['answer']

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

    def create_vector_store(self, file, collection_name):
        # get pdf text
        raw_text = self.get_pdf_text(file)

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
