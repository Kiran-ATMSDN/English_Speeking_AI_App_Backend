# Local TTS Service (Free)

This service provides local text-to-speech with `pyttsx3`.

## 1) Setup

```bash
cd local_tts_service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## 2) Run

```bash
uvicorn app:app --host 127.0.0.1 --port 8002
```

## 3) Health check

Open:

`http://127.0.0.1:8002/health`

Expected:

```json
{
  "status": "ok",
  "engine": "pyttsx3"
}
```

## 4) Backend integration

In backend `.env`:

```env
TEXT_TO_SPEECH_PROVIDER=local_tts
LOCAL_TTS_URL=http://127.0.0.1:8002/synthesize
LOCAL_TTS_VOICE=en-us
```

After updates, restart backend:

```bash
npm run dev
```
