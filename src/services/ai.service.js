const axios = require("axios");
const { Conversation } = require("../models");

const AI_PROVIDER = String(process.env.AI_PROVIDER || "ollama").toLowerCase();

const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
const OPENAI_RETRY_DELAY_MS = 1200;

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
const OLLAMA_CHAT_URL = `${OLLAMA_BASE_URL}/api/chat`;
const OLLAMA_TAGS_URL = `${OLLAMA_BASE_URL}/api/tags`;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1:8b";
const OLLAMA_AUTO_FALLBACK =
  String(process.env.OLLAMA_AUTO_FALLBACK || "true").toLowerCase() !== "false";

function getOpenAiKey() {
  const key = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
  if (!key) {
    throw new Error(
      "OpenAI key is missing. Set OPENAI_API_KEY (or OPENAI_KEY) in backend .env and restart server."
    );
  }
  return key;
}

async function createOpenAiCompletion(messages, responseFormat = null, temperature = 0.3) {
  const payload = {
    model: OPENAI_CHAT_MODEL,
    messages,
    temperature,
  };

  if (responseFormat) {
    payload.response_format = responseFormat;
  }

  let response;
  try {
    response = await axios.post(OPENAI_CHAT_URL, payload, {
      headers: {
        Authorization: `Bearer ${getOpenAiKey()}`,
        "Content-Type": "application/json",
      },
      timeout: 45000,
    });
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 429) {
      await new Promise((resolve) => setTimeout(resolve, OPENAI_RETRY_DELAY_MS));
      response = await axios.post(OPENAI_CHAT_URL, payload, {
        headers: {
          Authorization: `Bearer ${getOpenAiKey()}`,
          "Content-Type": "application/json",
        },
        timeout: 45000,
      });
    } else {
      throw error;
    }
  }

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI response content is empty.");
  }

  return content;
}

function isOllamaModelNotFoundError(error) {
  const statusCode = error?.response?.status;
  const message = String(error?.response?.data?.error || "").toLowerCase();
  return statusCode === 404 && message.includes("model");
}

async function getAvailableOllamaModels() {
  const response = await axios.get(OLLAMA_TAGS_URL, { timeout: 15000 });
  const models = response.data?.models || [];
  return models.map((item) => item.name).filter(Boolean);
}

async function sendOllamaChat(model, messages, responseFormat, temperature) {
  const payload = {
    model,
    messages,
    stream: false,
    options: {
      temperature,
    },
  };

  if (responseFormat) {
    payload.format = "json";
  }

  return axios.post(OLLAMA_CHAT_URL, payload, {
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 60000,
  });
}

async function createOllamaCompletion(messages, responseFormat = null, temperature = 0.3) {
  let response;
  try {
    response = await sendOllamaChat(OLLAMA_MODEL, messages, responseFormat, temperature);
  } catch (error) {
    if (!OLLAMA_AUTO_FALLBACK || !isOllamaModelNotFoundError(error)) {
      throw error;
    }

    const availableModels = await getAvailableOllamaModels();
    if (availableModels.length === 0) {
      throw new Error(
        `Ollama model not found: ${OLLAMA_MODEL}. No installed models detected. Run: ollama pull ${OLLAMA_MODEL}`
      );
    }

    response = await sendOllamaChat(
      availableModels[0],
      messages,
      responseFormat,
      temperature
    );
  }

  const content = response.data?.message?.content;
  if (!content) {
    throw new Error("Ollama response content is empty.");
  }

  return content;
}

async function createChatCompletion(messages, responseFormat = null, temperature = 0.3) {
  if (AI_PROVIDER === "openai") {
    return createOpenAiCompletion(messages, responseFormat, temperature);
  }

  return createOllamaCompletion(messages, responseFormat, temperature);
}

function extractJsonObject(text) {
  try {
    return JSON.parse(text);
  } catch (_error) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      return null;
    }
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch (_innerError) {
      return null;
    }
  }
}

function mapAiError(error) {
  const statusCode = error?.response?.status;
  const apiMessage = error?.response?.data?.error?.message || error?.response?.data?.message;

  if (AI_PROVIDER === "ollama") {
    if (error?.code === "ECONNREFUSED") {
      return {
        statusCode: 503,
        message:
          "Ollama is not running. Start Ollama and run: ollama pull llama3.1:8b",
      };
    }

    if (statusCode === 404) {
      return {
        statusCode: 404,
        message: `Ollama model not found: ${OLLAMA_MODEL}. Run: ollama pull ${OLLAMA_MODEL}`,
      };
    }

    if (statusCode >= 500) {
      return {
        statusCode: 502,
        message: "Ollama service error. Please retry after a moment.",
      };
    }

    return {
      statusCode: 500,
      message: apiMessage || error.message || "Unexpected Ollama processing error.",
    };
  }

  if (statusCode === 429) {
    return {
      statusCode: 429,
      message:
        apiMessage ||
        "OpenAI rate limit or quota exceeded. Please check billing/quota or retry after some time.",
    };
  }

  if (statusCode === 401) {
    return {
      statusCode: 401,
      message: apiMessage || "OpenAI authentication failed. Check OPENAI_API_KEY.",
    };
  }

  if (statusCode === 400) {
    return {
      statusCode: 400,
      message: apiMessage || "OpenAI rejected this request. Please validate input/model settings.",
    };
  }

  if (statusCode >= 500) {
    return {
      statusCode: 502,
      message: "OpenAI service is temporarily unavailable. Please retry shortly.",
    };
  }

  return {
    statusCode: 500,
    message: error.message || "Unexpected AI processing error.",
  };
}

function parseMentorResponse(content) {
  const parsed = extractJsonObject(content);

  if (!parsed || !parsed.correction || !parsed.explanation || !parsed.nextQuestion) {
    throw new Error("Failed to parse AI mentor response as JSON.");
  }

  return parsed;
}

async function generateMentorResponse(userMessage) {
  const systemPrompt = `
You are an English teacher mentor.
When a user sends a sentence:
1. Correct grammar
2. Explain the correction simply
3. Ask a follow-up question to continue conversation
Return strict JSON with keys: correction, explanation, nextQuestion.
`;

  const openAiResponseFormat = {
    type: "json_schema",
    json_schema: {
      name: "mentor_response",
      strict: true,
      schema: {
        type: "object",
        properties: {
          correction: { type: "string" },
          explanation: { type: "string" },
          nextQuestion: { type: "string" },
        },
        required: ["correction", "explanation", "nextQuestion"],
        additionalProperties: false,
      },
    },
  };

  const content = await createChatCompletion(
    [
      { role: "system", content: systemPrompt.trim() },
      { role: "user", content: userMessage },
    ],
    AI_PROVIDER === "openai" ? openAiResponseFormat : { type: "json" }
  );

  return parseMentorResponse(content);
}

async function saveMentorConversation(userId, userMessage, mentorResult) {
  return Conversation.create({
    userId,
    userMessage,
    aiCorrection: mentorResult.correction,
    aiExplanation: mentorResult.explanation,
    aiNextQuestion: mentorResult.nextQuestion,
  });
}

async function generateAssistantMessage(userMessage, history = []) {
  const messages = [
    {
      role: "system",
      content:
        "You are a helpful English speaking mentor. Keep responses concise, clear, and conversation-friendly.",
    },
    ...history,
    { role: "user", content: userMessage },
  ];

  return createChatCompletion(messages, null, 0.6);
}

module.exports = {
  generateMentorResponse,
  saveMentorConversation,
  generateAssistantMessage,
  mapAiError,
};
