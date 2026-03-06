const express = require("express");
const { authenticate } = require("../middlewares/auth.middleware");
const {
  startConversation,
  sendConversationMessage,
  getConversationHistory,
} = require("../controllers/conversation.controller");

const router = express.Router();

router.post("/start", authenticate, startConversation);
router.post("/message", authenticate, sendConversationMessage);
router.get("/:sessionId", authenticate, getConversationHistory);

module.exports = router;
