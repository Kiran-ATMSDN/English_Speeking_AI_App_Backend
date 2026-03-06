const { generateMentorResponse, saveMentorConversation } = require("../services/ai.service");

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
    return res.error("Failed to process AI mentor chat.", 500, error.message);
  }
}

module.exports = {
  chatWithMentor,
};
