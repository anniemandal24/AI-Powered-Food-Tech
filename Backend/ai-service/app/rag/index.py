from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_qdrant import QdrantVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pathlib import Path
import os

gemini_embedding_model = GoogleGenerativeAIEmbeddings(
    api_key = os.getenv("GEMINI_API_KEY"),
    model = "models/gemini-embedding-001"
)

vector_store:QdrantVectorStore = None

async def text_to_embeddings(file_path:str, user_id:str):
    path = Path(file_path)
    loader = PyPDFLoader(file_path)
    docs = loader.load()
    # print(docs)

    text_splitter = await RecursiveCharacterTextSplitter(
        chunk_size = 1000,
        chunk_overlap = 400
    )

    chunks = await text_splitter.split_documents(
        documents = docs
    )

    vector_store = QdrantVectorStore.from_documents(
        embedding = gemini_embedding_model,
        url = os.getenv("QDRANT_URL"),
        collection_name = os.getenv("QDRANT_COLLECTION_NAME"),
        documents = chunks
    )

    for chunk in chunks:
        chunk.metadata["user_id"] = user_id
        chunk.metadata["filename"] = path.name

    vector_store.add_documents(chunks)

    print("Indexing of docs done.........")