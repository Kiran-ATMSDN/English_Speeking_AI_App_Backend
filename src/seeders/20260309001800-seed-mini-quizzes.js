"use strict";

function getLevel(day) {
  if (day <= 34) return "Simple";
  if (day <= 67) return "Intermediate";
  return "Advanced";
}

const questionBank = {
  Simple: [
    {
      question: "Choose the correct sentence for greeting someone politely.",
      options: ["What your name is?", "Hello, how are you?", "I am go market.", "Where you from is?"],
      correctAnswerIndex: 1,
      explanation: "Hello, how are you? is a correct and polite greeting sentence.",
    },
    {
      question: "Which word completes the sentence: I ___ learning English.",
      options: ["is", "am", "are", "be"],
      correctAnswerIndex: 1,
      explanation: "With subject I, the correct helping verb is am.",
    },
    {
      question: "Choose the correct question form.",
      options: ["Where you live?", "Where do you live?", "Where you do live?", "Where are live?"],
      correctAnswerIndex: 1,
      explanation: "Where do you live? uses the correct auxiliary do for present simple questions.",
    },
    {
      question: "Which sentence is correct?",
      options: ["She go to school.", "She goes to school.", "She going to school.", "She gone to school."],
      correctAnswerIndex: 1,
      explanation: "For he, she, and it in present simple, the verb usually takes s or es.",
    },
    {
      question: "Choose the correct reply to: Nice to meet you.",
      options: ["Nice to meet you too.", "I am from Delhi.", "Please sit down.", "I like tea."],
      correctAnswerIndex: 0,
      explanation: "Nice to meet you too. is the natural reply.",
    },
  ],
  Intermediate: [
    {
      question: "Choose the most professional sentence.",
      options: [
        "Send me this now.",
        "Could you please send me the document by noon?",
        "You send document fast.",
        "Document send today.",
      ],
      correctAnswerIndex: 1,
      explanation: "Could you please send me the document by noon? is clear and polite.",
    },
    {
      question: "Which connector best completes this sentence: I was tired, ___ I finished the task.",
      options: ["but", "or", "if", "because"],
      correctAnswerIndex: 0,
      explanation: "But is used to show contrast between being tired and still finishing the task.",
    },
    {
      question: "Choose the best follow-up question.",
      options: [
        "Where from?",
        "Can you tell me more about your experience?",
        "You experience what?",
        "What experience you have is?",
      ],
      correctAnswerIndex: 1,
      explanation: "The second option is grammatically correct and appropriate for a conversation.",
    },
    {
      question: "Which sentence shows future intention correctly?",
      options: [
        "I will meeting the client tomorrow.",
        "I am going to meet the client tomorrow.",
        "I going meet client tomorrow.",
        "I meet will client tomorrow.",
      ],
      correctAnswerIndex: 1,
      explanation: "I am going to meet the client tomorrow. correctly expresses future intention.",
    },
    {
      question: "Choose the best summary sentence.",
      options: [
        "Project good and team work.",
        "The project is on track, and the team has completed the main tasks.",
        "Team project complete maybe.",
        "Project was because team yes.",
      ],
      correctAnswerIndex: 1,
      explanation: "It is complete, clear, and professionally structured.",
    },
  ],
  Advanced: [
    {
      question: "Choose the strongest professional response.",
      options: [
        "I think maybe this can work somehow.",
        "Based on the current risks, I recommend a phased rollout with weekly reviews.",
        "Let's do anything now.",
        "This is difficult so no idea.",
      ],
      correctAnswerIndex: 1,
      explanation: "The second option is precise, confident, and solution oriented.",
    },
    {
      question: "Which sentence handles disagreement politely?",
      options: [
        "You are wrong.",
        "I understand your point, but I see the situation differently.",
        "No, bad idea.",
        "You don't know this.",
      ],
      correctAnswerIndex: 1,
      explanation: "It shows disagreement respectfully and keeps the conversation professional.",
    },
    {
      question: "Choose the best signpost phrase to conclude an explanation.",
      options: ["Actually", "By the way", "To sum up", "Maybe"],
      correctAnswerIndex: 2,
      explanation: "To sum up clearly signals that you are concluding your point.",
    },
    {
      question: "Which sentence is most concise and clear?",
      options: [
        "The reason due to which this happened is because the delay occurred.",
        "The delay happened because approval came late.",
        "Delay because happened approval.",
        "Approval and delay happened due to reason.",
      ],
      correctAnswerIndex: 1,
      explanation: "It is direct, grammatical, and easy to understand.",
    },
    {
      question: "Choose the best meeting opener.",
      options: [
        "Let's start by reviewing today's goals and expected outcomes.",
        "We meeting now maybe.",
        "Start this and see.",
        "Why all here yes.",
      ],
      correctAnswerIndex: 0,
      explanation: "It sets a structured and professional tone for the meeting.",
    },
  ],
};

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const rows = [];

    for (let day = 1; day <= 100; day += 1) {
      const level = getLevel(day);
      const source = questionBank[level][(day - 1) % questionBank[level].length];
      rows.push({
        day_number: day,
        level,
        question: source.question,
        options: JSON.stringify(source.options),
        correct_answer_index: source.correctAnswerIndex,
        explanation: source.explanation,
        created_at: now,
        updated_at: now,
      });
    }

    await queryInterface.bulkDelete({ tableName: "mini_quizzes", schema: "public" }, null, {});
    await queryInterface.bulkInsert({ tableName: "mini_quizzes", schema: "public" }, rows, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete({ tableName: "mini_quizzes", schema: "public" }, null, {});
  },
};
