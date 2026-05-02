from app.RAG.qdrant import vector_store
from qdrant_client import models

async def get_vector_search_result(user_id:str, user_query:str, filename:str):

    result = await vector_store.asimilarity_search(
        query = user_query,
        k = 2,
        filter = models.Filter(
            should = [
                models.FieldCondition(
                    key = "metadata.user_id",
                    match = models.MatchValue(
                        value = user_id
                    )
                ),

                models.FieldCondition(
                    key = "metadata.filename",
                    match = models.MatchValue(
                        value = filename
                    )
                )
            ]
        )
    )

    return result
