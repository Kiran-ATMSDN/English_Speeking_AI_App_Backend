const axios = require("axios");
const FormData = require("form-data");
const { Readable } = require("stream");
const fs = require("fs");
const path = require("path");

const OPENAI_TRANSCRIPTIONS_URL = "https://api.openai.com/v1/audio/transcriptions";
const OPENAI_SPEECH_URL = "https://api.openai.com/v1/audio/speech";
const STT_MODEL = process.env.OPENAI_STT_MODEL || "whisper-1";
const TTS_MODEL = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
const TTS_VOICE = process.env.OPENAI_TTS_VOICE || "alloy";

function getOpenAiKey() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_API_KEY is not configured.");
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

function ensureTtsDirectory() {
  const dirPath = path.join(process.cwd(), "public", "audio");
  fs.mkdirSync(dirPath, { recursive: true });
  return dirPath;
}

async function textToSpeech(text) {
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

module.exports = {
  transcribeAudio,
  textToSpeech,
};
