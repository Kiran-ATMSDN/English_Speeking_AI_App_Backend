const { User, UserOnboardingAnswer } = require("../models");
const onboardingQuestions = [
  {
    questionKey: "learning_purpose",
    questionText: "What is your purpose to learn English?",
  },
];

async function getOnboardingQuestions(_req, res) {
  return res.status(200).json({
    message: "Onboarding questions fetched successfully.",
    data: onboardingQuestions,
  });
}

async function saveOnboardingAnswer(req, res) {
  try {
    const { questionKey, questionText, answerText } = req.body;

    if (!questionKey || !questionText || !answerText) {
      return res.status(400).json({
        message: "questionKey, questionText and answerText are required.",
      });
    }

    const answer = await UserOnboardingAnswer.create({
      userId: req.user.userId,
      questionKey,
      questionText,
      answerText,
    });

    if (questionKey === "learning_purpose") {
      await User.update(
        { learningPurpose: answerText, onboardingCompleted: true },
        { where: { id: req.user.userId } }
      );
    }

    return res.status(201).json({
      message: "Onboarding answer saved.",
      data: answer,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to save onboarding answer.",
      error: error.message,
    });
  }
}

async function getMyOnboardingAnswers(req, res) {
  try {
    const answers = await UserOnboardingAnswer.findAll({
      where: { userId: req.user.userId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Onboarding answers fetched successfully.",
      data: answers,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch onboarding answers.",
      error: error.message,
    });
  }
}

module.exports = { getOnboardingQuestions, saveOnboardingAnswer, getMyOnboardingAnswers };
