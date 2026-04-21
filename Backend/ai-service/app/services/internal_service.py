import os
import httpx
from json import dumps

async def get_data_from_inventory(
    user_id:str,
    status:str
):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url = os.getenv(f"GET_INVENTORY_API/{status}"),
                json = {
                    "userId": user_id
                },
                timeout=5.0
            )

            if response.status_code == 200:
                data = response.json()
                return dumps[data]
            
            return "Recipe API returned an error."
    except Exception as e:
        return f"Internal API unavailable: {str(e)}"
    

async def get_items_tobe_expire(user_id:str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url = os.getenv("GET_INVENTORY_TOBE_EXPIRE_API"),
                json = {
                    "userId": user_id,
                },
                timeout=5.0
            )

            if response.status_code == 200:
                data = response.json()
                return dumps[data]
            
            return "Internal API returned an error."
    except Exception as e:
        return f"Internal API unavailable: {str(e)}"