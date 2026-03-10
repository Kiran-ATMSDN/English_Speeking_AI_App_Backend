const express = require("express");
const {
  getOnboardingQuestions,
  saveOnboardingAnswer,
  getMyOnboardingAnswers,
  getDailyVocabulary,
  getGrammarLessons,
  getCommonSentences,
  getConversationScripts,
  getPronunciationTips,
  getEnglishLearningTips,
  getMiniQuiz,
  getEnglishIdioms,
  getWordOfTheDay,
  getMotivationalMessages,
} = require("../controllers/onboarding.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/questions", getOnboardingQuestions);
router.post("/answer", authenticate, saveOnboardingAnswer);
router.get("/answers", authenticate, getMyOnboardingAnswers);
router.get("/daily-vocabulary", authenticate, getDailyVocabulary);
router.get("/grammar-lessons", authenticate, getGrammarLessons);
router.get("/common-sentences", authenticate, getCommonSentences);
router.get("/conversation-scripts", authenticate, getConversationScripts);
router.get("/pronunciation-tips", authenticate, getPronunciationTips);
router.get("/english-learning-tips", authenticate, getEnglishLearningTips);
router.get("/mini-quizzes", authenticate, getMiniQuiz);
router.get("/english-idioms", authenticate, getEnglishIdioms);
router.get("/word-of-the-day", authenticate, getWordOfTheDay);
router.get("/motivational-messages", authenticate, getMotivationalMessages);

module.exports = router;
