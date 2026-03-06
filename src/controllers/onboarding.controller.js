const { User, UserOnboardingAnswer } = require("../models");
const onboardingQuestions = [
  {
    questionKey: "learning_purpose",
    questionText: "What is your purpose to learn English?",
  },
];

async function getOnboardingQuestions(_req, res) {
  return res.success("Onboarding questions fetched successfully.", onboardingQuestions);
}

async function saveOnboardingAnswer(req, res) {
  try {
    const { questionKey, questionText, answerText } = req.body;

    if (!questionKey || !questionText || !answerText) {
      return res.error("questionKey, questionText and answerText are required.", 400);
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

    return res.success("Onboarding answer saved.", answer, 201);
  } catch (error) {
    return res.error("Failed to save onboarding answer.", 500, error.message);
  }
}

async function getMyOnboardingAnswers(req, res) {
  try {
    const answers = await UserOnboardingAnswer.findAll({
      where: { userId: req.user.userId },
      order: [["createdAt", "DESC"]],
    });

    return res.success("Onboarding answers fetched successfully.", answers);
  } catch (error) {
    return res.error("Failed to fetch onboarding answers.", 500, error.message);
  }
}

module.exports = { getOnboardingQuestions, saveOnboardingAnswer, getMyOnboardingAnswers };
