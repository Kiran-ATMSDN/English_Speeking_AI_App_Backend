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

module.exports = router;
