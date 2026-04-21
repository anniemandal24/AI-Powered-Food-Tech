from app.rag.index import vector_store

async def get_vector_search_result(user_id:str, user_query:str, filename:str):
    return await vector_store.similarity_search(
        query = user_query,
        filter = {
            "user_id":user_id,
            "filename":filename
        }
    )
