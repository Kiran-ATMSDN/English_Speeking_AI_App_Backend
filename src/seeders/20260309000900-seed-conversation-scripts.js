"use strict";

function getLevel(day) {
  if (day <= 34) return "Simple";
  if (day <= 67) return "Intermediate";
  return "Advanced";
}

const simpleScenarios = [
  ["Greeting a Friend", "Two friends meet in the morning."],
  ["At a Tea Stall", "Customer orders tea politely."],
  ["Asking Directions", "A person asks for route help."],
  ["Introducing Yourself", "You introduce yourself to someone new."],
  ["At a Grocery Shop", "You ask for daily items."],
];

const intermediateScenarios = [
  ["Office Check-in", "Colleagues discuss today's tasks."],
  ["Scheduling a Meeting", "You request and confirm a meeting time."],
  ["Customer Support Call", "You explain an issue and ask for resolution."],
  ["Project Update", "You share project progress with teammate."],
  ["Interview Preparation", "You answer common HR-style questions."],
];

const advancedScenarios = [
  ["Client Negotiation", "You discuss scope, timeline, and expectations."],
  ["Conflict Resolution", "Team members resolve a disagreement professionally."],
  ["Formal Presentation", "You open and close a structured presentation."],
  ["Escalation Discussion", "You explain risks and propose mitigation."],
  ["Leadership Conversation", "You provide constructive feedback to a team member."],
];

function scenarioByDay(day) {
  const set = day <= 34 ? simpleScenarios : day <= 67 ? intermediateScenarios : advancedScenarios;
  return set[(day - 1) % set.length];
}

function linesFor(level, title) {
  if (level === "Simple") {
    return [
      { speaker: "A", text: "Hello! How are you today?" },
      { speaker: "B", text: "I am good, thank you. How about you?" },
      { speaker: "A", text: "I am fine too. Nice to see you." },
      { speaker: "B", text: "Nice to see you too. Let's talk for a minute." },
      { speaker: "A", text: `Sure. Let's practice this topic: ${title}.` },
      { speaker: "B", text: "Great idea. Daily practice helps a lot." },
    ];
  }
  if (level === "Intermediate") {
    return [
      { speaker: "A", text: "Hi, do you have a minute to discuss today's plan?" },
      { speaker: "B", text: "Yes, absolutely. What should we prioritize first?" },
      { speaker: "A", text: "Let's start with urgent items and then review pending tasks." },
      { speaker: "B", text: "Sounds good. I'll update the tracker and share status." },
      { speaker: "A", text: "Perfect. Please highlight any blockers early." },
      { speaker: "B", text: "Sure, I'll send a clear update before end of day." },
    ];
  }
  return [
    { speaker: "A", text: "Thank you for joining. Let's align on objectives and expected outcomes." },
    { speaker: "B", text: "Certainly. Could you clarify the priority and timeline constraints?" },
    { speaker: "A", text: "Our priority is quality delivery with realistic milestones and risk visibility." },
    { speaker: "B", text: "Understood. I suggest a phased approach with weekly checkpoints." },
    { speaker: "A", text: "Agreed. Please document assumptions and share mitigation options." },
    { speaker: "B", text: "Done. I'll circulate a structured summary for final confirmation." },
  ];
}

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const rows = [];

    for (let day = 1; day <= 100; day += 1) {
      const level = getLevel(day);
      const [title, context] = scenarioByDay(day);
      rows.push({
        day_number: day,
        level,
        title: `${title} - Day ${day}`,
        context,
        lines: JSON.stringify(linesFor(level, title)),
        created_at: now,
        updated_at: now,
      });
    }

    await queryInterface.bulkDelete("conversation_scripts", null, {});
    await queryInterface.bulkInsert("conversation_scripts", rows, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("conversation_scripts", null, {});
  },
};
