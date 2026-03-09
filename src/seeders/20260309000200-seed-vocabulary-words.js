"use strict";

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const rows = [
      { level: "simple", word: "Improve", meaning_en: "To become better", meaning_hi: "behtar banna", example: "I want to improve my English.", sort_order: 1 },
      { level: "simple", word: "Learn", meaning_en: "To gain knowledge", meaning_hi: "seekhna", example: "I learn new words daily.", sort_order: 2 },
      { level: "simple", word: "Speak", meaning_en: "To talk with someone", meaning_hi: "bolna", example: "Speak slowly and clearly.", sort_order: 3 },
      { level: "simple", word: "Listen", meaning_en: "To hear carefully", meaning_hi: "dhyan se sunna", example: "Listen to English podcasts.", sort_order: 4 },
      { level: "simple", word: "Read", meaning_en: "To understand written words", meaning_hi: "padhna", example: "Read one short article daily.", sort_order: 5 },
      { level: "simple", word: "Write", meaning_en: "To put words on paper", meaning_hi: "likhna", example: "Write five lines every day.", sort_order: 6 },
      { level: "simple", word: "Practice", meaning_en: "To do repeatedly to improve", meaning_hi: "abhyas karna", example: "Practice speaking in front of a mirror.", sort_order: 7 },
      { level: "simple", word: "Question", meaning_en: "Something asked", meaning_hi: "prashn", example: "Ask one question in English.", sort_order: 8 },
      { level: "simple", word: "Answer", meaning_en: "A reply to a question", meaning_hi: "uttar", example: "Give a complete answer.", sort_order: 9 },
      { level: "simple", word: "Happy", meaning_en: "Feeling joy", meaning_hi: "khush", example: "I feel happy when I speak well.", sort_order: 10 },

      { level: "intermediate", word: "Confident", meaning_en: "Sure about yourself", meaning_hi: "aatmavishwasi", example: "She sounded confident in the interview.", sort_order: 1 },
      { level: "intermediate", word: "Fluent", meaning_en: "Able to speak smoothly", meaning_hi: "dhara-pravah", example: "He is becoming fluent in English.", sort_order: 2 },
      { level: "intermediate", word: "Accurate", meaning_en: "Correct and exact", meaning_hi: "sateek", example: "Try to give accurate answers.", sort_order: 3 },
      { level: "intermediate", word: "Clarify", meaning_en: "To make clear", meaning_hi: "spasht karna", example: "Please clarify your point.", sort_order: 4 },
      { level: "intermediate", word: "Respond", meaning_en: "To reply", meaning_hi: "pratikriya dena", example: "Respond politely to each question.", sort_order: 5 },
      { level: "intermediate", word: "Develop", meaning_en: "To grow gradually", meaning_hi: "vikasit karna", example: "Develop a daily speaking habit.", sort_order: 6 },
      { level: "intermediate", word: "Communicate", meaning_en: "To share ideas", meaning_hi: "sanchar karna", example: "Communicate your thoughts clearly.", sort_order: 7 },
      { level: "intermediate", word: "Vocabulary", meaning_en: "Collection of words", meaning_hi: "shabdavali", example: "Use new vocabulary in speech.", sort_order: 8 },
      { level: "intermediate", word: "Participate", meaning_en: "To take part", meaning_hi: "bhaag lena", example: "Participate in group discussions.", sort_order: 9 },
      { level: "intermediate", word: "Professional", meaning_en: "Related to workplace standards", meaning_hi: "peshevar", example: "Maintain a professional tone.", sort_order: 10 },

      { level: "advanced", word: "Articulate", meaning_en: "To express clearly", meaning_hi: "spasht roop se vyakt karna", example: "Articulate your ideas with confidence.", sort_order: 1 },
      { level: "advanced", word: "Persuasive", meaning_en: "Able to convince", meaning_hi: "prabhavshali", example: "Use persuasive language in presentations.", sort_order: 2 },
      { level: "advanced", word: "Nuance", meaning_en: "Subtle difference in meaning", meaning_hi: "sukshm antar", example: "Understand the nuance of each phrase.", sort_order: 3 },
      { level: "advanced", word: "Concise", meaning_en: "Short but clear", meaning_hi: "sankshept aur spasht", example: "Give concise interview responses.", sort_order: 4 },
      { level: "advanced", word: "Coherent", meaning_en: "Logical and well connected", meaning_hi: "susangat", example: "Keep your argument coherent.", sort_order: 5 },
      { level: "advanced", word: "Elaborate", meaning_en: "To explain in detail", meaning_hi: "vistar se batana", example: "Elaborate with one practical example.", sort_order: 6 },
      { level: "advanced", word: "Evaluate", meaning_en: "To judge value or quality", meaning_hi: "mulyankan karna", example: "Evaluate your speaking weekly.", sort_order: 7 },
      { level: "advanced", word: "Strategic", meaning_en: "Planned for a goal", meaning_hi: "rananeetik", example: "Take a strategic approach to preparation.", sort_order: 8 },
      { level: "advanced", word: "Credible", meaning_en: "Believable and trustworthy", meaning_hi: "vishwasniya", example: "Use credible examples in answers.", sort_order: 9 },
      { level: "advanced", word: "Analytical", meaning_en: "Using logical examination", meaning_hi: "vishleshanatmak", example: "Give an analytical explanation.", sort_order: 10 },
    ].map((row) => ({ ...row, created_at: now, updated_at: now }));

    await queryInterface.bulkInsert("vocabulary_words", rows, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("vocabulary_words", null, {});
  },
};
