"use strict";

function getLevel(day) {
  if (day <= 34) {
    return "Simple";
  }
  if (day <= 67) {
    return "Intermediate";
  }
  return "Advanced";
}

function buildDetailedExplanation(topic) {
  return [
    `Definition: ${topic.definition}`,
    `When to use: ${topic.usage}`,
    `Common mistake: ${topic.mistake}`,
    `Pro tip: ${topic.tip}`,
  ].join(" ");
}

function buildLesson(day) {
  const basicTopics = [
    {
      title: "Nouns",
      formula: "Person/Place/Thing/Idea",
      definition: "A noun names a person, place, thing, feeling, or idea.",
      usage: "Use nouns as subject or object in every sentence.",
      mistake: "Using verbs as nouns without changing form.",
      tip: "Identify noun first to build sentence structure correctly.",
      examples: [
        "Riya reads a book every night.",
        "Delhi is a busy city.",
        "Honesty is a great quality.",
      ],
    },
    {
      title: "Pronouns",
      formula: "Pronoun replaces noun",
      definition: "A pronoun replaces a noun to avoid repetition.",
      usage: "Use pronouns after introducing the noun once.",
      mistake: "Changing pronoun gender/number incorrectly.",
      tip: "Match pronoun with noun number and gender.",
      examples: [
        "Rohan is my friend. He helps me daily.",
        "The books are new. They are on the table.",
        "My sister and I study. We practice grammar together.",
      ],
    },
    {
      title: "Verbs",
      formula: "Subject + Verb",
      definition: "A verb shows action, event, or state.",
      usage: "Every complete sentence needs a main verb.",
      mistake: "Missing helping verb in continuous/perfect tense.",
      tip: "Find verb first when checking grammar errors.",
      examples: [
        "She writes emails every morning.",
        "They are preparing for exams.",
        "I have completed the assignment.",
      ],
    },
    {
      title: "Adjectives",
      formula: "Adjective + Noun",
      definition: "An adjective describes or qualifies a noun.",
      usage: "Use adjectives to add details like color, size, quality.",
      mistake: "Using adverb in place of adjective.",
      tip: "If you describe a noun, use adjective form.",
      examples: [
        "This is a difficult question.",
        "He bought a new laptop.",
        "She gave a clear explanation.",
      ],
    },
    {
      title: "Adverbs",
      formula: "Verb + Adverb",
      definition: "An adverb describes a verb, adjective, or another adverb.",
      usage: "Use adverbs to show how, when, where, or how much.",
      mistake: "Using adjective where adverb is required.",
      tip: "If describing action, usually adverb is correct.",
      examples: [
        "She speaks clearly in class.",
        "He arrived early for the interview.",
        "They worked very carefully.",
      ],
    },
    {
      title: "Simple Present",
      formula: "Subject + V1(s/es)",
      definition: "Simple present expresses routine, habit, fact, or universal truth.",
      usage: "Use daily actions and permanent truths.",
      mistake: "Forgetting s/es with he/she/it.",
      tip: "Check subject first, then decide verb form.",
      examples: [
        "He goes to office at 9 AM.",
        "Water boils at 100 degrees Celsius.",
        "I revise grammar every night.",
      ],
    },
    {
      title: "Simple Past",
      formula: "Subject + V2",
      definition: "Simple past describes completed actions in the past.",
      usage: "Use when time is finished, like yesterday/last week.",
      mistake: "Using present verb with past time markers.",
      tip: "Use V2 for positive sentence, did + V1 for questions.",
      examples: [
        "She visited Jaipur last month.",
        "I completed my homework yesterday.",
        "Did you watch the lesson video?",
      ],
    },
    {
      title: "Simple Future",
      formula: "Subject + will + V1",
      definition: "Simple future talks about decisions, promises, and predictions.",
      usage: "Use for future plans decided now.",
      mistake: "Using V2 after will.",
      tip: "Always use base verb (V1) after will.",
      examples: [
        "I will call you after class.",
        "They will submit the file tomorrow.",
        "She will improve with regular practice.",
      ],
    },
    {
      title: "Articles",
      formula: "a / an / the + noun",
      definition: "Articles indicate whether noun is general or specific.",
      usage: "Use a/an for first mention, the for specific noun.",
      mistake: "Using an before consonant sound.",
      tip: "Choose a/an by sound, not only by spelling.",
      examples: [
        "I bought a pen and an eraser.",
        "The pen is blue.",
        "She is an honest person.",
      ],
    },
    {
      title: "Prepositions",
      formula: "in/on/at/by/with + noun",
      definition: "Prepositions show relation of place, time, direction, or method.",
      usage: "Use to connect noun with rest of sentence.",
      mistake: "Confusing in/on/at for time and place.",
      tip: "Learn common combinations through daily sentences.",
      examples: [
        "The meeting starts at 10 AM.",
        "My book is on the table.",
        "He lives in Mumbai.",
      ],
    },
  ];

  const intermediateTopics = [
    {
      title: "Present Continuous",
      formula: "Subject + is/am/are + V1+ing",
      definition: "Present continuous describes action happening now or around now.",
      usage: "Use for temporary current activity.",
      mistake: "Using V1 without is/am/are.",
      tip: "Always pair ing verb with correct helping verb.",
      examples: [
        "I am studying grammar now.",
        "They are discussing the project.",
        "She is preparing for an interview.",
      ],
    },
    {
      title: "Past Continuous",
      formula: "Subject + was/were + V1+ing",
      definition: "Past continuous shows ongoing action at a specific time in past.",
      usage: "Useful when two past actions happen together.",
      mistake: "Using was with plural subjects.",
      tip: "Use was for singular, were for plural/I-you-we-they.",
      examples: [
        "I was reading when he called.",
        "They were watching TV at 8 PM.",
        "She was writing notes during class.",
      ],
    },
    {
      title: "Future Continuous",
      formula: "Subject + will be + V1+ing",
      definition: "Future continuous shows ongoing action at a future time.",
      usage: "Use to describe future progress.",
      mistake: "Using will + V1+ing without be.",
      tip: "The structure must include will be.",
      examples: [
        "At 9 PM, I will be revising grammar.",
        "They will be traveling tomorrow morning.",
        "She will be presenting in the meeting.",
      ],
    },
    {
      title: "Present Perfect",
      formula: "Subject + has/have + V3",
      definition: "Present perfect links past action to present result.",
      usage: "Use for experience, change, or completed action without fixed time.",
      mistake: "Using V2 instead of V3.",
      tip: "Remember: has/have always needs third form.",
      examples: [
        "I have finished my assignment.",
        "She has improved her fluency.",
        "They have already left.",
      ],
    },
    {
      title: "Past Perfect",
      formula: "Subject + had + V3",
      definition: "Past perfect shows an earlier action before another past action.",
      usage: "Use to set timeline clearly in past narration.",
      mistake: "Using had with V2 instead of V3.",
      tip: "If two past actions exist, earlier one often takes had + V3.",
      examples: [
        "I had eaten before the class started.",
        "She had left when I reached.",
        "They had completed the task by evening.",
      ],
    },
    {
      title: "Modal Verbs",
      formula: "modal + V1",
      definition: "Modals express ability, permission, advice, possibility, or obligation.",
      usage: "Use can/could/must/should/might with base verb.",
      mistake: "Adding s/es/ed after modal.",
      tip: "After every modal, always use V1 only.",
      examples: [
        "You should practice daily.",
        "I can understand this topic now.",
        "They must submit the form today.",
      ],
    },
    {
      title: "Comparatives",
      formula: "A + adjective-er + than + B",
      definition: "Comparative form compares two people, places, or things.",
      usage: "Use when exactly two items are compared.",
      mistake: "Using more with short adjectives unnecessarily.",
      tip: "Short adjectives take -er, longer ones take more.",
      examples: [
        "This task is easier than yesterday's task.",
        "She is more confident than before.",
        "My laptop is faster than yours.",
      ],
    },
    {
      title: "Superlatives",
      formula: "the + adjective-est / most + adjective",
      definition: "Superlative expresses highest degree among three or more.",
      usage: "Use with 'the' before adjective.",
      mistake: "Forgetting 'the' in superlative sentence.",
      tip: "Use superlative only when group comparison exists.",
      examples: [
        "She is the most active student in class.",
        "This is the best solution.",
        "He is the fastest runner in the team.",
      ],
    },
    {
      title: "Passive Voice",
      formula: "Object + be + V3 (+ by + subject)",
      definition: "Passive focuses on action/result, not performer.",
      usage: "Use when doer is unknown or unimportant.",
      mistake: "Using V1/V2 instead of V3.",
      tip: "Choose helping verb by tense first, then V3.",
      examples: [
        "The report was submitted on time.",
        "English is spoken worldwide.",
        "The email has been sent.",
      ],
    },
    {
      title: "Reported Speech",
      formula: "Reporting verb + clause",
      definition: "Reported speech tells what someone said without exact quote.",
      usage: "Useful in writing, meetings, and summaries.",
      mistake: "Not changing tense/pronoun when needed.",
      tip: "Adjust tense, pronouns, and time words carefully.",
      examples: [
        "He said that he was busy.",
        "She told me that she would call later.",
        "They asked if I had completed the work.",
      ],
    },
  ];

  const advancedTopics = [
    {
      title: "Conditional Type 1",
      formula: "If + present, will + V1",
      definition: "Type 1 conditional talks about real and possible future results.",
      usage: "Use for practical advice and likely outcomes.",
      mistake: "Using will in both clauses.",
      tip: "If-clause takes present, main clause takes will.",
      examples: [
        "If you practice daily, you will improve quickly.",
        "If it rains, we will stay inside.",
        "If she studies hard, she will pass.",
      ],
    },
    {
      title: "Conditional Type 2",
      formula: "If + past, would + V1",
      definition: "Type 2 conditional describes unreal or unlikely situations.",
      usage: "Use for imagination, advice, hypothetical ideas.",
      mistake: "Using present form in if-clause.",
      tip: "Use were with all subjects in formal style.",
      examples: [
        "If I were you, I would revise every day.",
        "If he had more time, he would travel.",
        "If we lived near office, we would walk.",
      ],
    },
    {
      title: "Conditional Type 3",
      formula: "If + had + V3, would have + V3",
      definition: "Type 3 conditional talks about impossible past results.",
      usage: "Use for regret or reflection on past events.",
      mistake: "Mixing V2 instead of had + V3.",
      tip: "Both clauses refer to past and cannot be changed now.",
      examples: [
        "If I had left early, I would have caught the train.",
        "If she had studied, she would have passed.",
        "If they had informed me, I would have helped.",
      ],
    },
    {
      title: "Relative Clauses",
      formula: "who/which/that + clause",
      definition: "Relative clauses add essential or extra information about a noun.",
      usage: "Use to combine ideas smoothly in one sentence.",
      mistake: "Using wrong relative pronoun for people/things.",
      tip: "Use who for people, which for things, that for both (common).",
      examples: [
        "The student who won the prize is my friend.",
        "This is the book that I bought yesterday.",
        "The car which was parked outside is mine.",
      ],
    },
    {
      title: "Subject-Verb Agreement",
      formula: "Subject and verb must match",
      definition: "Verb form changes according to subject number and person.",
      usage: "Essential in all formal and spoken English.",
      mistake: "Using plural verb with singular subject and vice versa.",
      tip: "Ignore long phrases and identify main subject first.",
      examples: [
        "The list of tasks is ready.",
        "The students are waiting.",
        "Each of the players is prepared.",
      ],
    },
    {
      title: "Gerunds and Infinitives",
      formula: "V+ing / to + V1",
      definition: "Some verbs take gerund, some take infinitive, some allow both.",
      usage: "Use correctly after common verbs for natural speech.",
      mistake: "Using to + V1 after verbs that require gerund.",
      tip: "Memorize high-frequency verb patterns.",
      examples: [
        "I enjoy reading grammar books.",
        "She decided to join the class.",
        "They stopped talking and started writing.",
      ],
    },
    {
      title: "Parallel Structure",
      formula: "same grammar pattern in a list",
      definition: "Parallelism keeps sentence balanced and easy to read.",
      usage: "Use in lists, comparisons, and paired ideas.",
      mistake: "Mixing noun/verb forms in same series.",
      tip: "Check each part of list has same grammatical form.",
      examples: [
        "She likes reading, writing, and speaking.",
        "The job requires planning, execution, and review.",
        "He wants to learn, to practice, and to improve.",
      ],
    },
    {
      title: "Inversion",
      formula: "Auxiliary + subject + main verb",
      definition: "Inversion changes normal word order for emphasis/formality.",
      usage: "Use in formal writing or advanced expression.",
      mistake: "Using inversion in casual speech unnecessarily.",
      tip: "Use only in fixed expressions and formal context.",
      examples: [
        "Rarely have I seen such dedication.",
        "Not only did she pass, but she topped.",
        "Never had they faced this challenge before.",
      ],
    },
    {
      title: "Complex Sentences",
      formula: "Main clause + subordinate clause",
      definition: "Complex sentences connect dependent and independent ideas.",
      usage: "Use conjunctions to show reason, condition, contrast, time.",
      mistake: "Incorrect punctuation and connector placement.",
      tip: "Choose conjunction by relationship between ideas.",
      examples: [
        "Although it was late, we completed the report.",
        "Because she practiced daily, she became fluent.",
        "If you focus, you can improve quickly.",
      ],
    },
    {
      title: "Punctuation for Clarity",
      formula: "comma / semicolon / colon",
      definition: "Correct punctuation changes meaning and improves readability.",
      usage: "Use punctuation to separate ideas and avoid confusion.",
      mistake: "Overusing commas or missing full stops.",
      tip: "Read sentence aloud; pause points often need punctuation.",
      examples: [
        "Let's eat, Rahul.",
        "The agenda is clear: review, decide, and act.",
        "She prepared well; therefore, she succeeded.",
      ],
    },
  ];

  const set = day <= 34 ? basicTopics : day <= 67 ? intermediateTopics : advancedTopics;
  const topic = set[(day - 1) % set.length];
  const level = getLevel(day);

  return {
    day_number: day,
    level,
    title: `${topic.title} - Day ${day}`,
    explanation: buildDetailedExplanation(topic),
    formula: topic.formula,
    examples: topic.examples,
  };
}

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const rows = [];

    for (let day = 1; day <= 100; day += 1) {
      const lesson = buildLesson(day);
      rows.push({
        ...lesson,
        examples: JSON.stringify(lesson.examples),
        created_at: now,
        updated_at: now,
      });
    }

    await queryInterface.bulkDelete("grammar_lessons", null, {});
    await queryInterface.bulkInsert("grammar_lessons", rows, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("grammar_lessons", null, {});
  },
};
