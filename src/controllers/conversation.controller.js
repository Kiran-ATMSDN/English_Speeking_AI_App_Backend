const {
  startSession,
  getSessionForUser,
  getSessionMessages,
  sendMessageAndReply,
} = require("../services/conversation.service");

async function startConversation(req, res) {
  try {
    const session = await startSession(req.user.userId);
    return res.success("Conversation started successfully.", { sessionId: session.id }, 201);
  } catch (error) {
    return res.error("Failed to start conversation.", 500, error.message);
  }
}

async function sendConversationMessage(req, res) {
  try {
    const sessionId = Number(req.body.sessionId);
    const message = String(req.body.message || "").trim();

    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      return res.error("Valid sessionId is required.", 400);
    }

    if (!message) {
      return res.error("message is required.", 400);
    }

    const session = await getSessionForUser(sessionId, req.user.userId);
    if (!session) {
      return res.error("Conversation session not found.", 404);
    }

    const assistantMessage = await sendMessageAndReply(sessionId, message);

    return res.success("Message processed successfully.", {
      sessionId,
      assistantMessage,
    });
  } catch (error) {
    return res.error("Failed to process conversation message.", 500, error.message);
  }
}

async function getConversationHistory(req, res) {
  try {
    const sessionId = Number(req.params.sessionId);
    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      return res.error("Valid sessionId is required.", 400);
    }

    const session = await getSessionForUser(sessionId, req.user.userId);
    if (!session) {
      return res.error("Conversation session not found.", 404);
    }

    const messages = await getSessionMessages(sessionId);
    const history = messages.map((item) => ({
      role: item.role,
      message: item.message,
      createdAt: item.createdAt,
    }));

    return res.success("Conversation history fetched successfully.", history);
  } catch (error) {
    return res.error("Failed to fetch conversation history.", 500, error.message);
  }
}

module.exports = {
  startConversation,
  sendConversationMessage,
  getConversationHistory,
};
