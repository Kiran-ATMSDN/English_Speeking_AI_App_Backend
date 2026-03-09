"use strict";

function pushUnique(rows, seen, level, sentence, meaningHi, usageTip) {
  const key = `${level}::${sentence.trim().toLowerCase()}`;
  if (seen.has(key)) {
    return;
  }
  seen.add(key);
  rows.push({ level, sentence, meaning_hi: meaningHi, usage_tip: usageTip });
}

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const rows = [];
    const seen = new Set();

    const beginner = [
      ["Hello, how are you?", "Namaste, aap kaise hain?", "Use as a polite greeting."],
      ["I am fine, thank you.", "Main theek hoon, dhanyavaad.", "Use to reply politely."],
      ["What is your name?", "Aapka naam kya hai?", "Use when meeting someone new."],
      ["My name is Rahul.", "Mera naam Rahul hai.", "Use for self introduction."],
      ["Nice to meet you.", "Aapse milkar accha laga.", "Use after introduction."],
      ["Please speak slowly.", "Kripya dheere boliye.", "Use when you need clarity."],
      ["Can you help me?", "Kya aap meri madad kar sakte hain?", "Use to ask for help."],
      ["Where are you from?", "Aap kahan se hain?", "Use in basic conversation."],
      ["I am from India.", "Main India se hoon.", "Use to tell your origin."],
      ["I don't understand.", "Mujhe samajh nahi aaya.", "Use when something is unclear."],
      ["Could you repeat that?", "Kya aap phir se bol sakte hain?", "Use to ask repetition."],
      ["Please wait a minute.", "Kripya ek minute ruk jaiye.", "Use to request short time."],
      ["I am learning English.", "Main English seekh raha/rahi hoon.", "Use to tell your goal."],
      ["Let's practice together.", "Chaliye saath me practice karte hain.", "Use to invite practice."],
      ["See you tomorrow.", "Kal milte hain.", "Use while ending conversation."],
    ];

    beginner.forEach(([s, h, u]) => pushUnique(rows, seen, "simple", s, h, u));

    const subjects = ["I", "We", "You", "They", "He", "She"];
    const dailyVerbs = [
      "go to work",
      "study English",
      "read the notes",
      "practice speaking",
      "watch tutorials",
      "join the class",
      "complete the task",
      "check the message",
      "call my friend",
      "drink tea",
    ];
    const times = ["every day", "in the morning", "in the evening", "after lunch", "before sleep"];

    for (const sub of subjects) {
      for (const verb of dailyVerbs) {
        for (const time of times) {
          const sentence = `${sub} ${verb} ${time}.`;
          pushUnique(
            rows,
            seen,
            "simple",
            sentence,
            "Yeh rojana jeevan me istemal hone wala seedha vaakya hai.",
            "Use this sentence in daily routine conversations."
          );
        }
      }
    }

    const intermediatePatterns = [
      "Could you please share the {item}?",
      "I would like to discuss the {item}.",
      "Can we reschedule the {item}?",
      "Please let me know about the {item}.",
      "I will update you regarding the {item}.",
      "We should review the {item} today.",
    ];
    const items = [
      "report",
      "meeting",
      "schedule",
      "task",
      "document",
      "plan",
      "invoice",
      "feedback",
      "submission",
      "project timeline",
    ];

    for (const pattern of intermediatePatterns) {
      for (const item of items) {
        const sentence = pattern.replace("{item}", item);
        pushUnique(
          rows,
          seen,
          "intermediate",
          sentence,
          "Yeh vaakya office aur professional baat-cheet me kaafi useful hai.",
          "Use this in workplace communication."
        );
      }
    }

    const advancedPatterns = [
      "To avoid confusion, please confirm the {item} by end of day.",
      "For better coordination, we should align on the {item} first.",
      "Based on our discussion, I have refined the {item}.",
      "At your earliest convenience, please review the {item}.",
      "From a practical perspective, this approach improves the {item}.",
      "I appreciate your feedback; it helped us optimize the {item}.",
    ];
    const advancedItems = [
      "execution plan",
      "delivery schedule",
      "communication flow",
      "quality checklist",
      "project priorities",
      "client response",
      "training strategy",
      "risk summary",
      "team workflow",
      "weekly goals",
    ];

    for (const pattern of advancedPatterns) {
      for (const item of advancedItems) {
        const sentence = pattern.replace("{item}", item);
        pushUnique(
          rows,
          seen,
          "advanced",
          sentence,
          "Yeh sentence formal aur professional communication ke liye upyogi hai.",
          "Use this in advanced formal communication."
        );
      }
    }

    const enriched = rows.map((row, i) => ({
      ...row,
      sort_order: i + 1,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkDelete("common_sentences", null, {});
    await queryInterface.bulkInsert("common_sentences", enriched, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("common_sentences", null, {});
  },
};
