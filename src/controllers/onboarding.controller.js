const { User, UserOnboardingAnswer, VocabularyWord } = require("../models");

const onboardingQuestions = [
  {
    questionKey: "learning_purpose",
    questionText: "What is your purpose to learn English?",
  },
];

const TOTAL_DAYS = 100;
const WORDS_PER_DAY = 5;

function getDateOnly(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getDayNumberFromStartDate(startDate) {
  const today = getDateOnly(new Date());
  const start = getDateOnly(startDate);
  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const day = diffDays + 1;

  if (day < 1) {
    return 1;
  }
  if (day > TOTAL_DAYS) {
    return TOTAL_DAYS;
  }
  return day;
}

function getLevelByDay(dayNumber) {
  if (dayNumber <= 34) {
    return "simple";
  }
  if (dayNumber <= 67) {
    return "intermediate";
  }
  return "advanced";
}

function levelLabel(level) {
  if (level === "simple") {
    return "Simple";
  }
  if (level === "intermediate") {
    return "Intermediate";
  }
  return "Advanced";
}

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

async function getDailyVocabulary(req, res) {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ["id", "createdAt"],
    });

    if (!user) {
      return res.error("User not found.", 404);
    }

    const requestedDay = Number.parseInt(req.query.day, 10);
    const fallbackDay = getDayNumberFromStartDate(user.createdAt);
    const dayNumber =
      Number.isInteger(requestedDay) && requestedDay >= 1 && requestedDay <= TOTAL_DAYS
        ? requestedDay
        : fallbackDay;

    const level = getLevelByDay(dayNumber);
    const wordsFromDb = await VocabularyWord.findAll({
      where: { level },
      order: [["sortOrder", "ASC"], ["id", "ASC"]],
      attributes: ["word", "meaningEn", "meaningHi", "example"],
    });

    if (!wordsFromDb.length) {
      return res.error(
        "Vocabulary words are not seeded in database. Run migrations and seeders.",
        500
      );
    }

    const start = ((dayNumber - 1) * WORDS_PER_DAY) % wordsFromDb.length;
    const words = [];
    for (let i = 0; i < WORDS_PER_DAY; i += 1) {
      words.push(wordsFromDb[(start + i) % wordsFromDb.length]);
    }

    return res.success("Daily vocabulary fetched successfully.", {
      dayNumber,
      totalDays: TOTAL_DAYS,
      wordsPerDay: WORDS_PER_DAY,
      level: levelLabel(level),
      words,
      date: new Date().toISOString().slice(0, 10),
    });
  } catch (error) {
    return res.error("Failed to fetch daily vocabulary.", 500, error.message);
  }
}

module.exports = {
  getOnboardingQuestions,
  saveOnboardingAnswer,
  getMyOnboardingAnswers,
  getDailyVocabulary,
};
