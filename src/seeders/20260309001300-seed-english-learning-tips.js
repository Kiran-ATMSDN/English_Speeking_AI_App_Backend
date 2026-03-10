"use strict";

const timestamp = new Date();

const tipSets = {
  simple: [
    {
      title: "Speak Every Day",
      description:
        "Speak in English for at least five minutes daily. Use simple sentences about your routine, your family, or what you see around you so your mouth gets used to forming English sounds.",
      action_step:
        "Say five sentences about your day in English before sleeping.",
    },
    {
      title: "Learn Useful Phrases",
      description:
        "Focus on full phrases instead of single words. Beginners speak more naturally when they remember ready-to-use lines such as 'How are you?' or 'Can you help me?'",
      action_step:
        "Memorize three phrases and use them in one short self-practice conversation.",
    },
    {
      title: "Read Aloud Slowly",
      description:
        "Reading aloud improves pronunciation, confidence, and sentence rhythm. Start slowly so you can notice each word clearly instead of rushing and making repeated mistakes.",
      action_step:
        "Read one short paragraph aloud two times every day.",
    },
    {
      title: "Listen Before You Copy",
      description:
        "Good speaking starts with good listening. Hear how native or fluent speakers stress words and pause between ideas before trying to repeat the same sentence yourself.",
      action_step:
        "Play one short English clip and repeat one sentence after it three times.",
    },
    {
      title: "Use English In Small Tasks",
      description:
        "Attach English to your normal daily life. Name objects, describe actions, and think of short commands in English while cooking, walking, or working.",
      action_step:
        "Describe five objects around you in English right now.",
    },
    {
      title: "Keep A Word Notebook",
      description:
        "Write useful daily communication words with meaning and one personal example. Personal examples are easier to remember than dictionary sentences because they connect to your life.",
      action_step:
        "Write three new words and one simple sentence for each word.",
    },
    {
      title: "Record Your Voice",
      description:
        "When you record yourself, you hear mistakes that are easy to miss while speaking. This makes self-correction much faster and improves confidence over time.",
      action_step:
        "Record a 30-second introduction and listen to it once.",
    },
    {
      title: "Repeat Common Questions",
      description:
        "Most daily conversations begin with common question patterns. Practicing them helps you respond faster and reduces hesitation in real situations.",
      action_step:
        "Practice five questions like 'Where are you from?' and answer each aloud.",
    },
    {
      title: "Think In Short English Sentences",
      description:
        "You do not need to think in full complex grammar at first. Build the habit with short sentences such as 'I am hungry' or 'I need water' during the day.",
      action_step:
        "Think in English for one minute during a routine activity.",
    },
    {
      title: "Review Yesterday's Learning",
      description:
        "Quick revision prevents forgetting. Even five minutes of review can make yesterday's words and phrases feel familiar and easier to use today.",
      action_step:
        "Review yesterday's three words and speak them in new sentences.",
    },
  ],
  intermediate: [
    {
      title: "Expand Short Answers",
      description:
        "Do not stop at one-word replies. Add one more sentence to explain your point, because longer responses improve fluency and help conversations continue naturally.",
      action_step:
        "For five questions, give an answer with at least two sentences.",
    },
    {
      title: "Use Connectors",
      description:
        "Words like 'because', 'but', 'so', and 'however' connect ideas and make your speech sound smoother. They also help you express reasons and contrast clearly.",
      action_step:
        "Create four spoken sentences using different connectors.",
    },
    {
      title: "Shadow Native Audio",
      description:
        "Shadowing means speaking with the audio almost at the same time. This improves rhythm, stress, pace, and confidence because you copy real spoken English patterns.",
      action_step:
        "Shadow a 20-second clip two times without pausing too much.",
    },
    {
      title: "Practice Topic Speaking",
      description:
        "Choose one topic and speak for one minute without stopping. This trains idea flow and teaches you to keep talking even when you cannot find perfect words.",
      action_step:
        "Speak for one minute on food, travel, work, or family.",
    },
    {
      title: "Paraphrase Simple Ideas",
      description:
        "Paraphrasing teaches flexibility. If you forget one word, you can still explain your idea using other words instead of stopping the conversation completely.",
      action_step:
        "Explain one idea in two different ways.",
    },
    {
      title: "Ask Follow-Up Questions",
      description:
        "Good communication is not only about answering. Follow-up questions keep the conversation alive and show interest in the other person.",
      action_step:
        "After each practice answer, ask one related question aloud.",
    },
    {
      title: "Notice Your Repeated Mistakes",
      description:
        "Many learners repeat the same grammar or pronunciation mistakes for weeks. Tracking them directly helps you improve faster than only learning new content.",
      action_step:
        "Write down your top three repeated mistakes and correct them aloud.",
    },
    {
      title: "Use Real-Life Scenarios",
      description:
        "Practice English in situations you actually need, such as office calls, ordering food, introducing yourself, or asking for information. Real contexts improve retention.",
      action_step:
        "Act out one real-life situation for one minute.",
    },
    {
      title: "Build Listening And Speaking Together",
      description:
        "When you learn only speaking or only listening, progress becomes slower. Combining both helps you understand natural replies and answer more confidently.",
      action_step:
        "Listen to a short clip, then summarize it in three spoken sentences.",
    },
    {
      title: "Improve Speaking Speed Gradually",
      description:
        "Fluency does not mean speaking fast immediately. First speak clearly, then slowly increase speed while keeping pronunciation and grammar understandable.",
      action_step:
        "Say the same short paragraph once slowly and once a little faster.",
    },
  ],
  advanced: [
    {
      title: "Speak With Clear Structure",
      description:
        "Advanced speaking becomes stronger when your response has a beginning, explanation, and conclusion. Structured answers sound more professional and easier to follow.",
      action_step:
        "Answer one question in three parts: main point, reason, and conclusion.",
    },
    {
      title: "Use Precise Vocabulary",
      description:
        "At higher levels, clear word choice matters more than difficult word choice. Prefer accurate, natural vocabulary that fits the context rather than using complex words unnecessarily.",
      action_step:
        "Replace five vague words like 'good' or 'nice' with more precise alternatives.",
    },
    {
      title: "Control Your Pauses",
      description:
        "Intentional pauses make you sound thoughtful and confident. Uncontrolled pauses filled with 'umm' and 'aaa' reduce clarity and weaken professional speaking.",
      action_step:
        "Practice one response and pause silently between ideas instead of using filler sounds.",
    },
    {
      title: "Develop Formal And Casual Styles",
      description:
        "Strong communicators change tone based on the situation. You should be able to speak casually with friends and more formally in meetings or interviews.",
      action_step:
        "Say the same message once casually and once in a professional style.",
    },
    {
      title: "Summarize Complex Information",
      description:
        "Being able to simplify long information is a powerful communication skill. It shows understanding and helps you explain ideas clearly to others.",
      action_step:
        "Take one long point and summarize it in three clear sentences.",
    },
    {
      title: "Use Signpost Language",
      description:
        "Expressions like 'first', 'in addition', 'for example', and 'to conclude' guide listeners through your message. This improves presentations and professional communication.",
      action_step:
        "Give a short explanation using at least four signpost phrases.",
    },
    {
      title: "Refine Your Pronunciation",
      description:
        "At advanced level, pronunciation work is about clarity and consistency rather than perfection. Focus on stress, sentence melody, and difficult sound combinations.",
      action_step:
        "Practice one sentence by marking stressed words and reading it aloud three times.",
    },
    {
      title: "Respond Without Translation",
      description:
        "Try to reduce mental translation from your first language. Direct English processing makes responses faster, smoother, and more natural in live conversation.",
      action_step:
        "Answer five easy questions immediately in English without preparing in your first language.",
    },
    {
      title: "Handle Disagreement Politely",
      description:
        "Advanced communication includes expressing disagreement respectfully. This is important in workplaces, discussions, and interviews where tone matters as much as content.",
      action_step:
        "Practice three polite disagreement phrases and use them in example responses.",
    },
    {
      title: "Review Performance Critically",
      description:
        "High-level improvement requires honest review. Listen for clarity, logic, grammar, pronunciation, and confidence, then choose one point to improve next.",
      action_step:
        "Record a one-minute response and write one strength plus one improvement point.",
    },
  ],
};

function buildRows() {
  return Object.entries(tipSets).flatMap(([level, tips]) =>
    tips.map((tip, index) => ({
      level,
      title: tip.title,
      description: tip.description,
      action_step: tip.action_step,
      sort_order: index + 1,
      created_at: timestamp,
      updated_at: timestamp,
    }))
  );
}

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkDelete({ tableName: "english_learning_tips", schema: "public" }, null, {});
    await queryInterface.bulkInsert(
      { tableName: "english_learning_tips", schema: "public" },
      buildRows(),
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete({ tableName: "english_learning_tips", schema: "public" }, null, {});
  },
};
