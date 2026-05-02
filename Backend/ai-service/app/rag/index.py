from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pathlib import Path
from app.RAG.qdrant import vector_store

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size = 500,
    chunk_overlap = 100
)


async def text_to_embeddings(file_path:str, user_id:str):
    path = Path(file_path)
    loader = PyPDFLoader(file_path)
    docs = loader.load()

    chunks = text_splitter.split_documents(
        documents = docs
    )

    for chunk in chunks:
        chunk.metadata["user_id"] = user_id
        chunk.metadata["filename"] = path.name

    vector_store.add_documents(chunks)

    print("Indexing of docs done.........")