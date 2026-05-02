from mem0 import Memory
import os

config = {
    "version":"v1.1",
    "embedder":{
        "provider":"gemini",
        "config":{
            "api_key":os.getenv("GEMINI_API_KEY"),
            "model":"models/gemini-embedding-001"
        },
    },
    "llm":{
        "provider":"gemini",
        "config":{
            "api_key":os.getenv("GEMINI_API_KEY"),
            "model":"gemini-2.0-flash-001"
        },
    },

    "graph_store":{
        "provider":"neo4j",
        "config":{
            "url":os.getenv("NEO4J_URI"),
            "username":os.getenv("NEO4J_USERNAME"),
            "password":os.getenv("NEO4J_PASSWORD")
        }
    },

    "vector_store":{
        "provider":"qdrant",
        "config":{
            "host":"localhost",
            "port":"6333"
        }
    } 
}

mem_client = Memory.from_config(config)

async def search_in_memory(user_id, user_query):
    try:
        get_mem = await mem_client.search(
            user_id = user_id,
            query = user_query,
            limit = 4
        )

        memories = [
            f"ID: {mem.get("id")}\n Memory: {mem.get("memory")}" 
            for mem in get_mem.get("results")
        ] 

        return memories
    
    except Exception as e:
        print("Error occured while searching for memory", e)
        return []


async def add_memory(user_id:str, user_query:str, ai_response:str):
    try:
        await mem_client.add(
            messages = [
                {"role":"user", "content":user_query},
                {"role":"assistant", "content":ai_response}
            ],
            user_id = user_id
        )

        print("Memory added to mem0")

    except Exception as e:
        print("Error occured while adding for memory", e)
        return None



    