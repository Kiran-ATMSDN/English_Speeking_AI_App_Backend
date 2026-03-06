const express = require("express");
const { authenticate } = require("../middlewares/auth.middleware");
const { chatWithMentor } = require("../controllers/ai.controller");

const router = express.Router();

router.post("/chat", authenticate, chatWithMentor);

module.exports = router;
