const {
  generateMentorResponse,
  saveMentorConversation,
  mapAiError,
} = require("../services/ai.service");

function isFallbackEnabled() {
  const envValue = String(process.env.AI_FALLBACK_ON_429 || "").toLowerCase();

  if (envValue === "true" || envValue === "1") {
    return true;
  }

  if (envValue === "false" || envValue === "0") {
    return false;
  }

  return process.env.NODE_ENV !== "production";
}

function buildFallbackMentorResponse(message) {
  return {
    correction: message,
    explanation:
      "This is a fallback mentor response because AI quota/rate limit was reached.",
    nextQuestion: "Can you rewrite your sentence in past tense and send again?",
  };
}

async function chatWithMentor(req, res) {
  try {
    const message = String(req.body.message || "").trim();
    if (!message) {
      return res.error("message is required.", 400);
    }

    const mentorResult = await generateMentorResponse(message);
    await saveMentorConversation(req.user.userId, message, mentorResult);

    return res.success("AI mentor response generated.", mentorResult);
  } catch (error) {
    const mapped = mapAiError(error);

    if (mapped.statusCode === 429 && isFallbackEnabled()) {
      const message = String(req.body.message || "").trim();
      const fallbackResult = buildFallbackMentorResponse(message);
      try {
        await saveMentorConversation(req.user.userId, message, fallbackResult);
      } catch (_dbError) {
        // Do not block frontend flow if fallback persistence fails.
      }

      return res.success("AI quota exceeded, returned fallback mentor response.", {
        ...fallbackResult,
        isFallback: true,
      });
    }

    return res.error("Failed to process AI mentor chat.", mapped.statusCode, mapped.message);
  }
}

module.exports = {
  chatWithMentor,
};
