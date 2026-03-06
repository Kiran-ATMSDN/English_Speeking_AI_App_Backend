# Local Whisper Service (Free STT)

This service provides a local `POST /transcribe` API using `faster-whisper`.

## 1) Setup

```bash
cd local_whisper_service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## 2) Run

```bash
set LOCAL_WHISPER_MODEL=base
set LOCAL_WHISPER_COMPUTE_TYPE=int8
set LOCAL_WHISPER_DEVICE=auto
uvicorn app:app --host 127.0.0.1 --port 8001
```

## 3) Health check

Open:

`http://127.0.0.1:8001/health`

Expected:

```json
{
  "status": "ok",
  "model": "base",
  "device": "auto"
}
```

## 4) Backend integration

In backend `.env`:

```env
SPEECH_TO_TEXT_PROVIDER=local_whisper
LOCAL_WHISPER_URL=http://127.0.0.1:8001/transcribe
LOCAL_WHISPER_MODEL=base
LOCAL_WHISPER_LANGUAGE=en
```
