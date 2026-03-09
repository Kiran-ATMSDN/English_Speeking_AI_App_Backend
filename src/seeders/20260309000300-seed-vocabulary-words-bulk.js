"use strict";

function toTitle(value) {
  return value
    .split(" ")
    .map((x) => (x ? x[0].toUpperCase() + x.slice(1) : x))
    .join(" ");
}

function uniquePush(target, seen, level, word, meaningEn, meaningHi, example) {
  const normalizedWord = String(word || "").trim().toLowerCase();
  if (!normalizedWord) {
    return;
  }
  const key = `${level}::${normalizedWord}`;
  if (seen.has(key)) {
    return;
  }
  seen.add(key);
  target.push({
    level,
    word: toTitle(normalizedWord),
    meaning_en: meaningEn,
    meaning_hi: meaningHi,
    example,
  });
}

function buildSimpleWords(target, seen) {
  const basics = [
    "hello", "hi", "thanks", "please", "sorry", "welcome", "yes", "no", "okay", "fine",
    "good", "better", "best", "right", "wrong", "today", "tomorrow", "morning", "evening", "night",
    "friend", "family", "home", "office", "school", "college", "market", "shop", "road", "station",
    "food", "water", "tea", "coffee", "milk", "bread", "rice", "fruit", "vegetable", "snack",
    "money", "price", "bill", "ticket", "phone", "message", "call", "email", "meeting", "work",
    "learn", "read", "write", "listen", "speak", "ask", "answer", "start", "finish", "repeat",
    "happy", "sad", "angry", "calm", "busy", "free", "early", "late", "fast", "slow",
    "clean", "dirty", "open", "close", "buy", "sell", "bring", "take", "give", "help",
    "simple", "easy", "hard", "clear", "ready", "important", "useful", "normal", "common", "daily",
  ];

  basics.forEach((w) => {
    uniquePush(
      target,
      seen,
      "simple",
      w,
      `A commonly used daily communication word: ${w}.`,
      `${w} ka aam rojana prayog hone wala shabd`,
      `I use "${w}" in daily conversation.`
    );
  });

  const starters = ["good", "nice", "great", "quick", "short", "simple", "daily", "clear", "small", "local"];
  const nouns = [
    "message", "question", "answer", "meeting", "schedule", "plan", "idea", "problem", "solution", "support",
    "practice", "conversation", "routine", "request", "update", "notice", "reminder", "discussion", "response", "detail",
  ];

  for (const a of starters) {
    for (const b of nouns) {
      uniquePush(
        target,
        seen,
        "simple",
        `${a} ${b}`,
        "A short daily-use phrase.",
        "rojana baat-cheet me istemal hone wala chhota phrase",
        `Please share a ${a} ${b}.`
      );
      if (target.length >= 1000) {
        return;
      }
    }
  }
}

function buildIntermediateWords(target, seen) {
  const verbs = [
    "confirm", "schedule", "discuss", "explain", "improve", "prepare", "organize", "check", "update", "review",
    "connect", "inform", "clarify", "respond", "compare", "suggest", "decide", "manage", "handle", "continue",
    "complete", "follow", "coordinate", "deliver", "arrange", "notify", "share", "present", "practice", "record",
    "analyze", "monitor", "maintain", "assist", "guide", "describe", "summarize", "observe", "request", "resolve",
  ];
  const objects = [
    "the task", "the report", "the document", "the meeting", "the plan", "the timeline", "the issue", "the request", "the update", "the message",
    "your progress", "this point", "the details", "the process", "the schedule", "the feedback", "the result", "the target", "the activity", "the notes",
    "the assignment", "the payment", "the file", "the profile", "the appointment", "the discussion", "the call", "the email", "the submission", "the revision",
  ];
  const connectors = ["today", "tomorrow", "soon", "carefully", "clearly", "quickly", "again", "properly", "on time", "with confidence"];

  for (const v of verbs) {
    for (const o of objects) {
      for (const c of connectors) {
        uniquePush(
          target,
          seen,
          "intermediate",
          `${v} ${o} ${c}`,
          "A practical phrase used in daily communication and workplace context.",
          "rojana sanchar aur kaam me istemal hone wala vyavaharik phrase",
          `Please ${v} ${o} ${c}.`
        );
        if (target.length >= 2000) {
          return;
        }
      }
    }
  }
}

function buildAdvancedWords(target, seen) {
  const openings = [
    "could you please", "would you mind", "it would be helpful to", "let us", "we should", "kindly",
    "to move forward", "for better clarity", "as discussed", "based on your feedback",
  ];
  const actions = [
    "share the final update", "review the complete draft", "clarify the expected outcome", "align on the next steps",
    "reconfirm the schedule", "highlight the key risks", "prepare a concise summary", "provide supporting details",
    "improve the response quality", "finalize the communication plan",
  ];
  const closings = [
    "by end of day", "before the meeting", "at your earliest convenience", "to avoid confusion", "for quick resolution",
    "for better coordination", "so we stay on track", "with a clear timeline", "for smooth execution", "with measurable results",
  ];

  for (const a of openings) {
    for (const b of actions) {
      for (const c of closings) {
        uniquePush(
          target,
          seen,
          "advanced",
          `${a} ${b} ${c}`,
          "An advanced communication phrase for professional or formal conversation.",
          "peshevar ya formal baat-cheet ke liye advanced sanchar phrase",
          `${toTitle(a)} ${b} ${c}.`
        );
        if (target.length >= 3000) {
          return;
        }
      }
    }
  }
}

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const rows = [];
    const seen = new Set();
    const now = new Date();

    buildSimpleWords(rows, seen);
    buildIntermediateWords(rows, seen);
    buildAdvancedWords(rows, seen);

    const withOrder = rows.map((row, index) => ({
      ...row,
      sort_order: index + 1,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkDelete("vocabulary_words", null, {});
    await queryInterface.bulkInsert("vocabulary_words", withOrder, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("vocabulary_words", null, {});
  },
};
