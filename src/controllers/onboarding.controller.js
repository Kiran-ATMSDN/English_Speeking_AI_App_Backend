const {
  User,
  UserOnboardingAnswer,
  VocabularyWord,
  GrammarLesson,
  CommonSentence,
  ConversationScript,
  PronunciationTip,
  EnglishLearningTip,
  MiniQuiz,
  EnglishIdiom,
  WordOfTheDay,
  MotivationalMessage,
} = require("../models");

const onboardingQuestions = [
  {
    questionKey: "learning_purpose",
    questionText: "What is your purpose to learn English?",
  },
];

const TOTAL_DAYS = 100;
const WORDS_PER_DAY = 5;
const SENTENCES_PER_DAY = 5;
const PRONUNCIATION_TIPS_PER_DAY = 5;
const ENGLISH_LEARNING_TIPS_PER_DAY = 5;
const IDIOMS_PER_DAY = 5;
const MOTIVATIONAL_MESSAGES_PER_DAY = 3;

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
    const dayNumber =Number.isInteger(requestedDay) && requestedDay >= 1 && requestedDay <= TOTAL_DAYS? requestedDay: fallbackDay;

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

async function getGrammarLessons(req, res) {
  try {
    const requestedDay = Number.parseInt(req.query.day, 10);
    const totalDays = await GrammarLesson.count();

    if (!totalDays) {
      return res.error("Grammar lessons are not seeded in database. Run migrations and seeders.", 500);
    }

    let dayNumber = Number.isInteger(requestedDay) ? requestedDay : 1;
    if (dayNumber < 1) {
      dayNumber = 1;
    }
    if (dayNumber > totalDays) {
      dayNumber = totalDays;
    }

    const lesson = await GrammarLesson.findOne({
      where: { dayNumber },
      attributes: ["dayNumber", "level", "title", "explanation", "formula", "examples"],
    });

    if (!lesson) {
      return res.error("Grammar lesson not found for requested day.", 404);
    }

    return res.success("Grammar lesson fetched successfully.", {
      dayNumber: lesson.dayNumber,
      totalDays,
      level: lesson.level,
      lesson: {
        title: lesson.title,
        explanation: lesson.explanation,
        formula: lesson.formula,
        examples: lesson.examples || [],
      },
    });
  } catch (error) {
    return res.error("Failed to fetch grammar lesson.", 500, error.message);
  }
}

async function getCommonSentences(req, res) {
  try {
    const requestedDay = Number.parseInt(req.query.day, 10);
    let dayNumber = Number.isInteger(requestedDay) ? requestedDay : 1;

    if (dayNumber < 1) {
      dayNumber = 1;
    }
    if (dayNumber > TOTAL_DAYS) {
      dayNumber = TOTAL_DAYS;
    }

    const level = getLevelByDay(dayNumber);
    const sentencesFromDb = await CommonSentence.findAll({
      where: { level },
      order: [["sortOrder", "ASC"], ["id", "ASC"]],
      attributes: ["sentence", "meaningHi", "usageTip"],
    });

    if (!sentencesFromDb.length) {
      return res.error("Common sentences are not seeded in database. Run migrations and seeders.", 500);
    }

    const start = ((dayNumber - 1) * SENTENCES_PER_DAY) % sentencesFromDb.length;
    const sentences = [];
    for (let i = 0; i < SENTENCES_PER_DAY; i += 1) {
      sentences.push(sentencesFromDb[(start + i) % sentencesFromDb.length]);
    }

    return res.success("Common sentences fetched successfully.", {
      dayNumber,
      totalDays: TOTAL_DAYS,
      sentencesPerDay: SENTENCES_PER_DAY,
      level: levelLabel(level),
      sentences,
      date: new Date().toISOString().slice(0, 10),
    });
  } catch (error) {
    return res.error("Failed to fetch common sentences.", 500, error.message);
  }
}

async function getConversationScripts(req, res) {
  try {
    const requestedDay = Number.parseInt(req.query.day, 10);
    let dayNumber = Number.isInteger(requestedDay) ? requestedDay : 1;

    if (dayNumber < 1) {
      dayNumber = 1;
    }
    if (dayNumber > TOTAL_DAYS) {
      dayNumber = TOTAL_DAYS;
    }

    const script = await ConversationScript.findOne({
      where: { dayNumber },
      attributes: ["dayNumber", "level", "title", "context", "lines"],
    });

    if (!script) {
      return res.error("Conversation scripts are not seeded in database. Run migrations and seeders.", 500);
    }

    return res.success("Conversation script fetched successfully.", {
      dayNumber: script.dayNumber,
      totalDays: TOTAL_DAYS,
      level: script.level,
      script: {
        title: script.title,
        context: script.context,
        lines: script.lines || [],
      },
    });
  } catch (error) {
    return res.error("Failed to fetch conversation script.", 500, error.message);
  }
}

async function getPronunciationTips(req, res) {
  try {
    const requestedDay = Number.parseInt(req.query.day, 10);
    let dayNumber = Number.isInteger(requestedDay) ? requestedDay : 1;

    if (dayNumber < 1) {
      dayNumber = 1;
    }
    if (dayNumber > TOTAL_DAYS) {
      dayNumber = TOTAL_DAYS;
    }

    const level = getLevelByDay(dayNumber);
    const tipsFromDb = await PronunciationTip.findAll({
      where: { level },
      order: [["sortOrder", "ASC"], ["id", "ASC"]],
      attributes: ["title", "guide", "example"],
    });

    if (!tipsFromDb.length) {
      return res.error("Pronunciation tips are not seeded in database. Run migrations and seeders.", 500);
    }

    const start = ((dayNumber - 1) * PRONUNCIATION_TIPS_PER_DAY) % tipsFromDb.length;
    const tips = [];
    for (let i = 0; i < PRONUNCIATION_TIPS_PER_DAY; i += 1) {
      tips.push(tipsFromDb[(start + i) % tipsFromDb.length]);
    }

    return res.success("Pronunciation tips fetched successfully.", {
      dayNumber,
      totalDays: TOTAL_DAYS,
      tipsPerDay: PRONUNCIATION_TIPS_PER_DAY,
      level: levelLabel(level),
      tips,
      date: new Date().toISOString().slice(0, 10),
    });
  } catch (error) {
    return res.error("Failed to fetch pronunciation tips.", 500, error.message);
  }
}

async function getEnglishLearningTips(req, res) {
  try {
    const requestedDay = Number.parseInt(req.query.day, 10);
    let dayNumber = Number.isInteger(requestedDay) ? requestedDay : 1;

    if (dayNumber < 1) {
      dayNumber = 1;
    }
    if (dayNumber > TOTAL_DAYS) {
      dayNumber = TOTAL_DAYS;
    }

    const level = getLevelByDay(dayNumber);
    const tipsFromDb = await EnglishLearningTip.findAll({
      where: { level },
      order: [["sortOrder", "ASC"], ["id", "ASC"]],
      attributes: ["title", "description", "actionStep"],
    });

    if (!tipsFromDb.length) {
      return res.error("English learning tips are not seeded in database. Run migrations and seeders.", 500);
    }

    const start = ((dayNumber - 1) * ENGLISH_LEARNING_TIPS_PER_DAY) % tipsFromDb.length;
    const tips = [];
    for (let i = 0; i < ENGLISH_LEARNING_TIPS_PER_DAY; i += 1) {
      tips.push(tipsFromDb[(start + i) % tipsFromDb.length]);
    }

    return res.success("English learning tips fetched successfully.", {
      dayNumber,
      totalDays: TOTAL_DAYS,
      tipsPerDay: ENGLISH_LEARNING_TIPS_PER_DAY,
      level: levelLabel(level),
      tips,
      date: new Date().toISOString().slice(0, 10),
    });
  } catch (error) {
    return res.error("Failed to fetch English learning tips.", 500, error.message);
  }
}

async function getMiniQuiz(req, res) {
  try {
    const requestedDay = Number.parseInt(req.query.day, 10);
    let dayNumber = Number.isInteger(requestedDay) ? requestedDay : 1;

    if (dayNumber < 1) {
      dayNumber = 1;
    }
    if (dayNumber > TOTAL_DAYS) {
      dayNumber = TOTAL_DAYS;
    }

    const quiz = await MiniQuiz.findOne({
      where: { dayNumber },
      attributes: ["dayNumber", "level", "question", "options", "correctAnswerIndex", "explanation"],
    });

    if (!quiz) {
      return res.error("Mini quizzes are not seeded in database. Run migrations and seeders.", 500);
    }

    return res.success("Mini quiz fetched successfully.", {
      dayNumber: quiz.dayNumber,
      totalDays: TOTAL_DAYS,
      level: quiz.level,
      quiz: {
        question: quiz.question,
        options: quiz.options || [],
        correctAnswerIndex: quiz.correctAnswerIndex,
        explanation: quiz.explanation,
      },
    });
  } catch (error) {
    return res.error("Failed to fetch mini quiz.", 500, error.message);
  }
}

async function getEnglishIdioms(req, res) {
  try {
    const requestedDay = Number.parseInt(req.query.day, 10);
    let dayNumber = Number.isInteger(requestedDay) ? requestedDay : 1;

    if (dayNumber < 1) {
      dayNumber = 1;
    }
    if (dayNumber > TOTAL_DAYS) {
      dayNumber = TOTAL_DAYS;
    }

    const level = getLevelByDay(dayNumber);
    const idiomsFromDb = await EnglishIdiom.findAll({
      where: { level },
      order: [["sortOrder", "ASC"], ["id", "ASC"]],
      attributes: ["idiom", "meaning", "meaningHi", "example"],
    });

    if (!idiomsFromDb.length) {
      return res.error("English idioms are not seeded in database. Run migrations and seeders.", 500);
    }

    const start = ((dayNumber - 1) * IDIOMS_PER_DAY) % idiomsFromDb.length;
    const idioms = [];
    for (let i = 0; i < IDIOMS_PER_DAY; i += 1) {
      idioms.push(idiomsFromDb[(start + i) % idiomsFromDb.length]);
    }

    return res.success("English idioms fetched successfully.", {
      dayNumber,
      totalDays: TOTAL_DAYS,
      idiomsPerDay: IDIOMS_PER_DAY,
      level: levelLabel(level),
      idioms,
      date: new Date().toISOString().slice(0, 10),
    });
  } catch (error) {
    return res.error("Failed to fetch English idioms.", 500, error.message);
  }
}

async function getWordOfTheDay(req, res) {
  try {
    const requestedDay = Number.parseInt(req.query.day, 10);
    let dayNumber = Number.isInteger(requestedDay) ? requestedDay : 1;

    if (dayNumber < 1) {
      dayNumber = 1;
    }
    if (dayNumber > TOTAL_DAYS) {
      dayNumber = TOTAL_DAYS;
    }

    const word = await WordOfTheDay.findOne({
      where: { dayNumber },
      attributes: ["dayNumber", "level", "word", "meaningEn", "meaningHi", "example", "tip"],
    });

    if (!word) {
      return res.error("Word of the day data is not seeded in database. Run migrations and seeders.", 500);
    }

    return res.success("Word of the day fetched successfully.", {
      dayNumber: word.dayNumber,
      totalDays: TOTAL_DAYS,
      level: word.level,
      word: {
        word: word.word,
        meaningEn: word.meaningEn,
        meaningHi: word.meaningHi,
        example: word.example,
        tip: word.tip,
      },
    });
  } catch (error) {
    return res.error("Failed to fetch word of the day.", 500, error.message);
  }
}

async function getMotivationalMessages(req, res) {
  try {
    const requestedDay = Number.parseInt(req.query.day, 10);
    let dayNumber = Number.isInteger(requestedDay) ? requestedDay : 1;

    if (dayNumber < 1) {
      dayNumber = 1;
    }
    if (dayNumber > TOTAL_DAYS) {
      dayNumber = TOTAL_DAYS;
    }

    const level = getLevelByDay(dayNumber);
    const messagesFromDb = await MotivationalMessage.findAll({
      where: { level },
      order: [["sortOrder", "ASC"], ["id", "ASC"]],
      attributes: ["title", "message", "takeaway"],
    });

    if (!messagesFromDb.length) {
      return res.error("Motivational messages are not seeded in database. Run migrations and seeders.", 500);
    }

    const start = ((dayNumber - 1) * MOTIVATIONAL_MESSAGES_PER_DAY) % messagesFromDb.length;
    const messages = [];
    for (let i = 0; i < MOTIVATIONAL_MESSAGES_PER_DAY; i += 1) {
      messages.push(messagesFromDb[(start + i) % messagesFromDb.length]);
    }

    return res.success("Motivational messages fetched successfully.", {
      dayNumber,
      totalDays: TOTAL_DAYS,
      messagesPerDay: MOTIVATIONAL_MESSAGES_PER_DAY,
      level: levelLabel(level),
      messages,
      date: new Date().toISOString().slice(0, 10),
    });
  } catch (error) {
    return res.error("Failed to fetch motivational messages.", 500, error.message);
  }
}

module.exports = {
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
};
