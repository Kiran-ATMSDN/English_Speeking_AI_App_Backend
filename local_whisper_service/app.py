from faster_whisper import WhisperModel
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse
import os
import tempfile

app = FastAPI(title="Local Whisper Service")

model_size = os.getenv("LOCAL_WHISPER_MODEL", "base")
compute_type = os.getenv("LOCAL_WHISPER_COMPUTE_TYPE", "int8")
device = os.getenv("LOCAL_WHISPER_DEVICE", "auto")

model = WhisperModel(model_size, device=device, compute_type=compute_type)


@app.get("/health")
def health():
    return {"status": "ok", "model": model_size, "device": device}


@app.post("/transcribe")
async def transcribe(
    file: UploadFile = File(...),
    model_name: str = Form(default="base", alias="model"),
    language: str = Form(default="en"),
):
    if not file:
        raise HTTPException(status_code=400, detail="file is required")

    suffix = os.path.splitext(file.filename or "")[1] or ".wav"
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # model_name is accepted for API compatibility; loaded model comes from env at startup.
        segments, _info = model.transcribe(tmp_path, language=language)
        text = " ".join(segment.text.strip() for segment in segments).strip()

        return JSONResponse(content={"text": text, "model": model_size})
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"transcription failed: {str(exc)}")
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)
