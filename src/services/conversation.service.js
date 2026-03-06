const { ConversationSession, ConversationMessage } = require("../models");
const { generateAssistantMessage } = require("./ai.service");

async function startSession(userId) {
  return ConversationSession.create({ userId });
}

async function getSessionForUser(sessionId, userId) {
  return ConversationSession.findOne({
    where: {
      id: sessionId,
      userId,
    },
  });
}

async function addMessage(sessionId, role, message) {
  return ConversationMessage.create({
    sessionId,
    role,
    message,
  });
}

async function getSessionMessages(sessionId) {
  return ConversationMessage.findAll({
    where: { sessionId },
    order: [["createdAt", "ASC"]],
    attributes: ["id", "role", "message", "createdAt"],
  });
}

function toOpenAiHistory(messages) {
  return messages.map((item) => ({
    role: item.role,
    content: item.message,
  }));
}

async function sendMessageAndReply(sessionId, userMessage) {
  await addMessage(sessionId, "user", userMessage);

  const messagesAfterUser = await getSessionMessages(sessionId);
  const history = toOpenAiHistory(messagesAfterUser);
  const assistantMessage = await generateAssistantMessage(userMessage, history.slice(0, -1));

  await addMessage(sessionId, "assistant", assistantMessage);

  return assistantMessage;
}

module.exports = {
  startSession,
  getSessionForUser,
  getSessionMessages,
  sendMessageAndReply,
};
