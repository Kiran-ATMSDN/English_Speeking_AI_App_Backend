"use strict";

function getLevel(day) {
  if (day <= 34) return "Simple";
  if (day <= 67) return "Intermediate";
  return "Advanced";
}

const simpleWords = [
  ["Hello", "A common greeting used in daily communication.", "Rozmarra ki baat-chit me istemal hone wala abhivaadan.", "I said hello to my new classmate.", "Use it confidently to start a conversation."],
  ["Improve", "To become better or make something better.", "Behtar banana ya behtar hona.", "I want to improve my English speaking.", "Use it when talking about progress."],
  ["Practice", "Regular repeated effort to improve a skill.", "Kisi skill ko behtar karne ke liye niyamit abhyas.", "Daily practice makes my English stronger.", "This word fits every learning routine."],
  ["Listen", "To pay attention to sound or speech.", "Dhyan se sunna.", "Please listen carefully to the instructions.", "Use it often in classroom and conversation settings."],
  ["Answer", "A response to a question.", "Sawaal ka jawab.", "She gave the correct answer in class.", "Useful in quizzes, meetings, and interviews."],
];

const intermediateWords = [
  ["Confident", "Feeling sure about yourself and your ability.", "Atmavishwas se bhara hua.", "She sounded confident during the interview.", "Use this word when describing communication style."],
  ["Clarify", "To make an idea or message easier to understand.", "Kisi baat ko aur spasht karna.", "Could you clarify the last point?", "Helpful in professional communication."],
  ["Discuss", "To talk about something in detail.", "Kisi vishay par vistaar se baat karna.", "We will discuss the project after lunch.", "Useful in meetings and teamwork."],
  ["Respond", "To reply to someone or something.", "Pratikriya dena ya jawab dena.", "Please respond to the email by evening.", "Common in work and daily communication."],
  ["Progress", "Forward movement or improvement over time.", "Dheere-dheere aage badhna ya sudhaar.", "Your speaking progress is clearly visible.", "A strong word for learning goals."],
];

const advancedWords = [
  ["Articulate", "Able to express ideas clearly and effectively.", "Spasht aur prabhavi tareeke se baat rakhna.", "The candidate gave an articulate response.", "Very useful in interview and presentation contexts."],
  ["Concise", "Giving a lot of information in few clear words.", "Sankshipt lekin spasht.", "Please keep your summary concise.", "Important for professional communication."],
  ["Perspective", "A particular way of understanding or thinking about something.", "Nazariya ya drishtikon.", "I appreciate your perspective on this issue.", "Useful in discussions and formal speaking."],
  ["Refine", "To improve something by making small changes.", "Chhote sudhaaron se behtar banana.", "You should refine your introduction before the interview.", "A strong word for continuous improvement."],
  ["Insight", "A clear and deep understanding of something.", "Gehri samajh ya soojh-boojh.", "Her feedback gave me valuable insight.", "Useful in advanced speaking and writing."],
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const rows = [];

    for (let day = 1; day <= 100; day += 1) {
      const level = getLevel(day);
      const source = level === "Simple" ? simpleWords : level === "Intermediate" ? intermediateWords : advancedWords;
      const [word, meaningEn, meaningHi, example, tip] = source[(day - 1) % source.length];
      rows.push({
        day_number: day,
        level,
        word,
        meaning_en: meaningEn,
        meaning_hi: meaningHi,
        example,
        tip,
        created_at: now,
        updated_at: now,
      });
    }

    await queryInterface.bulkDelete("word_of_the_day", null, {});
    await queryInterface.bulkInsert("word_of_the_day", rows, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("word_of_the_day", null, {});
  },
};
