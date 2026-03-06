from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
import os
import pyttsx3
import tempfile

app = FastAPI(title="Local TTS Service")
engine = pyttsx3.init()


class SynthesizeRequest(BaseModel):
    text: str
    voice: str | None = None


def apply_voice(voice_hint: str | None):
    if not voice_hint:
        return

    voices = engine.getProperty("voices") or []
    target = voice_hint.lower()
    for voice in voices:
        name = (voice.name or "").lower()
        voice_id = (voice.id or "").lower()
        if target in name or target in voice_id:
            engine.setProperty("voice", voice.id)
            return


@app.get("/health")
def health():
    return {"status": "ok", "engine": "pyttsx3"}


@app.post("/synthesize")
def synthesize(req: SynthesizeRequest):
    text = (req.text or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")

    try:
        apply_voice(req.voice)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            temp_path = tmp.name

        engine.save_to_file(text, temp_path)
        engine.runAndWait()

        with open(temp_path, "rb") as f:
            audio_bytes = f.read()

        os.unlink(temp_path)
        return Response(content=audio_bytes, media_type="audio/wav")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"synthesis failed: {str(exc)}")
