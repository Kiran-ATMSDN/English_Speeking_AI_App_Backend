const axios = require("axios");
const FormData = require("form-data");
const { Readable } = require("stream");
const fs = require("fs");
const path = require("path");

const OPENAI_TRANSCRIPTIONS_URL = "https://api.openai.com/v1/audio/transcriptions";
const OPENAI_SPEECH_URL = "https://api.openai.com/v1/audio/speech";
const SPEECH_TO_TEXT_PROVIDER = String(
  process.env.SPEECH_TO_TEXT_PROVIDER || "openai"
).toLowerCase();
const TEXT_TO_SPEECH_PROVIDER = String(
  process.env.TEXT_TO_SPEECH_PROVIDER || "openai"
).toLowerCase();
const STT_MODEL = process.env.OPENAI_STT_MODEL || "whisper-1";
const LOCAL_WHISPER_URL =
  process.env.LOCAL_WHISPER_URL || "http://127.0.0.1:8001/transcribe";
const LOCAL_WHISPER_MODEL = process.env.LOCAL_WHISPER_MODEL || "base";
const LOCAL_WHISPER_LANGUAGE = process.env.LOCAL_WHISPER_LANGUAGE || "en";
const LOCAL_TTS_URL =
  process.env.LOCAL_TTS_URL || "http://127.0.0.1:8002/synthesize";
const LOCAL_TTS_VOICE = process.env.LOCAL_TTS_VOICE || "en-us";
const TTS_MODEL = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
const TTS_VOICE = process.env.OPENAI_TTS_VOICE || "alloy";

function getOpenAiKey() {
  const key = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
  if (!key) {
    throw new Error("OpenAI key is missing. Set OPENAI_API_KEY (or OPENAI_KEY) in backend .env and restart server.");
  }
  return key;
}

function bufferFromRequest(req) {
  if (Buffer.isBuffer(req.body) && req.body.length > 0) {
    return req.body;
  }

  const audioBase64 = req.body?.audioBase64;
  if (audioBase64) {
    return Buffer.from(audioBase64, "base64");
  }

  return null;
}

async function transcribeAudio(req) {
  const audioBuffer = bufferFromRequest(req);
  if (!audioBuffer || audioBuffer.length === 0) {
    throw new Error(
      "Audio file is required. Send raw audio body or JSON { audioBase64 }."
    );
  }

  const mimeType = req.headers["content-type"] || req.body?.mimeType || "audio/mpeg";
  const extension = mimeType.includes("wav")
    ? "wav"
    : mimeType.includes("webm")
      ? "webm"
      : mimeType.includes("mp4")
        ? "mp4"
        : "mp3";

  if (SPEECH_TO_TEXT_PROVIDER === "local_whisper") {
    return transcribeWithLocalWhisper(audioBuffer, mimeType, extension);
  }

  const formData = new FormData();
  formData.append("model", STT_MODEL);
  formData.append("file", Readable.from(audioBuffer), {
    filename: `speech-input.${extension}`,
    contentType: mimeType,
  });

  const response = await axios.post(OPENAI_TRANSCRIPTIONS_URL, formData, {
    headers: {
      Authorization: `Bearer ${getOpenAiKey()}`,
      ...formData.getHeaders(),
    },
    maxBodyLength: Infinity,
    timeout: 60000,
  });

  return response.data?.text || "";
}

async function transcribeWithLocalWhisper(audioBuffer, mimeType, extension) {
  const formData = new FormData();
  formData.append("model", LOCAL_WHISPER_MODEL);
  formData.append("language", LOCAL_WHISPER_LANGUAGE);
  formData.append("file", Readable.from(audioBuffer), {
    filename: `speech-input.${extension}`,
    contentType: mimeType,
  });

  const response = await axios.post(LOCAL_WHISPER_URL, formData, {
    headers: {
      ...formData.getHeaders(),
    },
    maxBodyLength: Infinity,
    timeout: 120000,
  });

  return response.data?.text || "";
}

function mapSpeechError(error) {
  if (SPEECH_TO_TEXT_PROVIDER === "local_whisper") {
    if (error?.code === "ECONNREFUSED") {
      return {
        statusCode: 503,
        message:
          "Local Whisper service is not running. Start service at LOCAL_WHISPER_URL.",
      };
    }

    const statusCode = error?.response?.status;
    const apiMessage = error?.response?.data?.error;
    if (statusCode === 400) {
      return {
        statusCode: 400,
        message: apiMessage || "Invalid audio payload for local Whisper service.",
      };
    }

    return {
      statusCode: 500,
      message: apiMessage || error.message || "Local Whisper transcription failed.",
    };
  }

  const statusCode = error?.response?.status;
  const apiMessage = error?.response?.data?.error?.message;

  if (statusCode === 401) {
    return {
      statusCode: 401,
      message: apiMessage || "OpenAI authentication failed for speech-to-text.",
    };
  }

  if (statusCode === 429) {
    return {
      statusCode: 429,
      message: apiMessage || "OpenAI speech-to-text quota/rate limit exceeded.",
    };
  }

  return {
    statusCode: 500,
    message: apiMessage || error.message || "Speech transcription failed.",
  };
}

function ensureTtsDirectory() {
  const dirPath = path.join(process.cwd(), "public", "audio");
  fs.mkdirSync(dirPath, { recursive: true });
  return dirPath;
}

async function textToSpeech(text) {
  if (TEXT_TO_SPEECH_PROVIDER === "local_tts") {
    return textToSpeechWithLocalTts(text);
  }

  const response = await axios.post(
    OPENAI_SPEECH_URL,
    {
      model: TTS_MODEL,
      voice: TTS_VOICE,
      input: text,
      format: "mp3",
    },
    {
      headers: {
        Authorization: `Bearer ${getOpenAiKey()}`,
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
      timeout: 60000,
    }
  );

  const audioDir = ensureTtsDirectory();
  const fileName = `tts-${Date.now()}.mp3`;
  const filePath = path.join(audioDir, fileName);
  fs.writeFileSync(filePath, Buffer.from(response.data));

  return fileName;
}

async function textToSpeechWithLocalTts(text) {
  const response = await axios.post(
    LOCAL_TTS_URL,
    {
      text,
      voice: LOCAL_TTS_VOICE,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
      timeout: 120000,
    }
  );

  const audioDir = ensureTtsDirectory();
  const fileName = `tts-local-${Date.now()}.wav`;
  const filePath = path.join(audioDir, fileName);
  fs.writeFileSync(filePath, Buffer.from(response.data));

  return fileName;
}

function mapTextToSpeechError(error) {
  if (TEXT_TO_SPEECH_PROVIDER === "local_tts") {
    if (error?.code === "ECONNREFUSED") {
      return {
        statusCode: 503,
        message: "Local TTS service is not running. Start service at LOCAL_TTS_URL.",
      };
    }

    const statusCode = error?.response?.status;
    const apiMessage = error?.response?.data?.error || error?.response?.data?.detail;

    if (statusCode === 400) {
      return {
        statusCode: 400,
        message: apiMessage || "Invalid text payload for local TTS service.",
      };
    }

    return {
      statusCode: 500,
      message: apiMessage || error.message || "Local TTS synthesis failed.",
    };
  }

  const statusCode = error?.response?.status;
  const apiMessage = error?.response?.data?.error?.message;

  if (statusCode === 401) {
    return {
      statusCode: 401,
      message: apiMessage || "OpenAI authentication failed for text-to-speech.",
    };
  }

  if (statusCode === 429) {
    return {
      statusCode: 429,
      message: apiMessage || "OpenAI text-to-speech quota/rate limit exceeded.",
    };
  }

  return {
    statusCode: 500,
    message: apiMessage || error.message || "Text-to-speech failed.",
  };
}

module.exports = {
  transcribeAudio,
  textToSpeech,
  mapSpeechError,
  mapTextToSpeechError,
};
