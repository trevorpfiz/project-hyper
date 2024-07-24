import os
import tempfile
import zipfile
import aiofiles

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from api.config import settings
from api.endpoints.v1.auth.verify import verify_token
from api.endpoints.v1.clients.anthropic import call_anthropic_api
from api.endpoints.v1.processing.text import (
    combine_texts,
    consolidate_texts,
    group_text_into_batches,
)

router = APIRouter()


@router.post("", status_code=200)
async def zip(file: UploadFile = File(...), user: str = Depends(verify_token)):
    """Secure endpoint to upload and process zip files, ensuring valid JWTs."""
    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            zip_path = os.path.join(temp_dir, file.filename)
            async with aiofiles.open(zip_path, "wb") as f:
                contents = await file.read()
                await f.write(contents)

            with zipfile.ZipFile(zip_path, "r") as zip_ref:
                zip_ref.extractall(temp_dir)

            pdf_texts, csv_texts = consolidate_texts(temp_dir)
            combined_text = combine_texts(pdf_texts, csv_texts)
            batches = group_text_into_batches(
                combined_text.splitlines(keepends=True), target_batch_size=86000
            )

            headers = {
                "x-api-key": settings.ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            }
            prechart = call_anthropic_api(batches, headers)

        return JSONResponse(
            content={
                "message": f"File processed and API called successfully by user {user}",
                "batches_processed": len(batches),
                "prechart": prechart,
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
