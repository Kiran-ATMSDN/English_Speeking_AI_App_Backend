const axios = require("axios");
const { Conversation } = require("../models");

const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";
const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

function getOpenAiKey() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }
  return key;
}

async function createChatCompletion(messages, responseFormat = null, temperature = 0.3) {
  const payload = {
    model: CHAT_MODEL,
    messages,
    temperature,
  };

  if (responseFormat) {
    payload.response_format = responseFormat;
  }

  const response = await axios.post(OPENAI_CHAT_URL, payload, {
    headers: {
      Authorization: `Bearer ${getOpenAiKey()}`,
      "Content-Type": "application/json",
    },
    timeout: 45000,
  });

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI response content is empty.");
  }

  return content;
}

function parseMentorResponse(content) {
  try {
    const parsed = JSON.parse(content);
    if (!parsed.correction || !parsed.explanation || !parsed.nextQuestion) {
      throw new Error("Missing keys in AI response.");
    }
    return parsed;
  } catch (_error) {
    throw new Error("Failed to parse AI mentor response as JSON.");
  }
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

  const responseFormat = {
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
    responseFormat
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
};
