const express = require("express");
const {
  getOnboardingQuestions,
  saveOnboardingAnswer,
  getMyOnboardingAnswers,
  getDailyVocabulary,
} = require("../controllers/onboarding.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/questions", getOnboardingQuestions);
router.post("/answer", authenticate, saveOnboardingAnswer);
router.get("/answers", authenticate, getMyOnboardingAnswers);
router.get("/daily-vocabulary", authenticate, getDailyVocabulary);

module.exports = router;
