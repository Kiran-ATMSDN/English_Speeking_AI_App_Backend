"use strict";

function createRows(level, items) {
  const now = new Date();
  return items.map((item, index) => ({
    level,
    title: item.title,
    message: item.message,
    takeaway: item.takeaway,
    sort_order: index + 1,
    created_at: now,
    updated_at: now,
  }));
}

const simple = [
  {
    title: "Start Small, Stay Regular",
    message: "Even ten minutes of English practice every day can create strong progress over time.",
    takeaway: "Do a small task daily instead of waiting for a perfect long session.",
  },
  {
    title: "Mistakes Mean Growth",
    message: "Every speaking mistake shows you exactly what to improve next. That is progress, not failure.",
    takeaway: "Speak first, then correct yourself calmly.",
  },
  {
    title: "Your Voice Matters",
    message: "You do not need perfect English to express useful ideas. Clear effort matters more than perfect grammar.",
    takeaway: "Speak with confidence even in simple sentences.",
  },
  {
    title: "Daily Repetition Works",
    message: "Repeating basic words, phrases, and questions makes them natural in real conversations.",
    takeaway: "Review yesterday's learning before adding something new.",
  },
  {
    title: "Consistency Beats Intensity",
    message: "One steady month of practice is better than one random day of heavy study.",
    takeaway: "Protect your daily habit.",
  },
];

const intermediate = [
  {
    title: "Fluency Builds Through Use",
    message: "The more you use English in real situations, the less you depend on translation.",
    takeaway: "Turn daily tasks into English practice moments.",
  },
  {
    title: "Progress Is Not Always Loud",
    message: "Sometimes your improvement is visible in fewer pauses, clearer sentences, and faster understanding.",
    takeaway: "Notice small wins in fluency and confidence.",
  },
  {
    title: "Confidence Comes After Repetition",
    message: "You do not wait to feel ready and then practice. You practice, and readiness begins to appear.",
    takeaway: "Repeat useful patterns until they feel natural.",
  },
  {
    title: "Your Accent Is Not The Problem",
    message: "Clarity matters more than sounding like someone else. Focus on understandable English.",
    takeaway: "Aim for clear pronunciation, not imitation perfection.",
  },
  {
    title: "Keep Going Through Discomfort",
    message: "Awkward practice sessions are often the ones that create the biggest jump in speaking ability.",
    takeaway: "Do not stop because a session feels difficult.",
  },
];

const advanced = [
  {
    title: "Sharpen, Do Not Just Repeat",
    message: "At advanced stages, progress comes from refining clarity, structure, and tone, not only from speaking more.",
    takeaway: "Review your speaking with a critical ear.",
  },
  {
    title: "Precision Creates Impact",
    message: "When your words are precise and well structured, people trust your communication more quickly.",
    takeaway: "Choose clear, exact language.",
  },
  {
    title: "Professional Calm Is A Skill",
    message: "Strong communicators stay calm, organized, and respectful even when the discussion becomes difficult.",
    takeaway: "Practice thoughtful responses instead of rushed reactions.",
  },
  {
    title: "Mastery Comes From Refinement",
    message: "High-level improvement is often about polishing small weaknesses that repeat again and again.",
    takeaway: "Work on one speaking weakness at a time.",
  },
  {
    title: "Your Next Level Needs Intention",
    message: "Advanced communication grows when you practice with a purpose, not when you only consume more content.",
    takeaway: "Set one speaking objective for each practice session.",
  },
];

module.exports = {
  async up(queryInterface) {
    const rows = [
      ...createRows("simple", simple),
      ...createRows("intermediate", intermediate),
      ...createRows("advanced", advanced),
    ];

    await queryInterface.bulkDelete("motivational_messages", null, {});
    await queryInterface.bulkInsert("motivational_messages", rows, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("motivational_messages", null, {});
  },
};
