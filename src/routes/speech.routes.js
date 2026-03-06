const express = require("express");
const { authenticate } = require("../middlewares/auth.middleware");
const { speechToText, convertTextToSpeech } = require("../controllers/speech.controller");

const router = express.Router();

router.post(
  "/speech-to-text",
  authenticate,
  express.raw({
    type: ["audio/*", "application/octet-stream"],
    limit: "25mb",
  }),
  speechToText
);
router.post("/text-to-speech", authenticate, convertTextToSpeech);

module.exports = router;
