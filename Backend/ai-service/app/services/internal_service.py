import os
import httpx

INTERNAL_BASE_URL = os.getenv("INTERNAL_BASE_URL")

async def get_inventory(user_id:str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url = f"{INTERNAL_BASE_URL}/user_inventory/{user_id}",
                # timeout=5.0
            )

            if response.status_code == 200:
                result = response.json()
                # print(result["data"], type(result["data"]))
                return result["data"]
            
            return "Recipe API returned an error."
        
    except Exception as e:
        return f"Internal API unavailable: {str(e)}"