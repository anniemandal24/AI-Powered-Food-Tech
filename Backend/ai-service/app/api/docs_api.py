from fastapi import UploadFile, APIRouter, Depends, HTTPException
from app.dependencies.jwt import verify_jwt
from app.RAG.index import text_to_embeddings
import tempfile
import os

router = APIRouter()

@router.post("/upload-pdf")
async def upload_pdf(
    file:UploadFile,
    user_id:str = Depends(verify_jwt)
):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=400, 
            detail="Only PDF files are allowed"
        )
    
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name

        await text_to_embeddings(
            file_path = tmp_path,
            user_id = user_id,
        )

        os.remove(tmp_path)

        return {
            "status": "success",
            "message": f"Successfully processed into vector chunks.",
            "fileName": file.filename
        }
    
    except Exception as e:
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            os.remove(tmp_path)
        raise HTTPException(status_code=500, detail=str(e))