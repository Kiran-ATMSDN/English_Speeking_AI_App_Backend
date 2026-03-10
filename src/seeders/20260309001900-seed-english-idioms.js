"use strict";

function createRows(level, items) {
  const now = new Date();
  return items.map((item, index) => ({
    level,
    idiom: item.idiom,
    meaning: item.meaning,
    meaning_hi: item.meaningHi,
    example: item.example,
    sort_order: index + 1,
    created_at: now,
    updated_at: now,
  }));
}

const simple = [
  ["Break the ice", "To start a friendly conversation and remove awkwardness.", "Baat-chit shuru karke jhijhak door karna.", "I told a small joke to break the ice in the class."],
  ["Piece of cake", "Something very easy to do.", "Bahut aasaan kaam.", "The first English quiz was a piece of cake for her."],
  ["Hit the books", "To start studying seriously.", "Gambhirta se padhai shuru karna.", "I need to hit the books before tomorrow's test."],
  ["In hot water", "In trouble because of something you did.", "Museebat me hona.", "He was in hot water after missing the meeting."],
  ["On the same page", "To have the same understanding.", "Ek hi samajh par hona.", "Let's discuss the plan so we are on the same page."],
  ["Call it a day", "To stop working for the day.", "Aaj ka kaam khatam karna.", "We finished the report, so let's call it a day."],
  ["Under the weather", "Feeling slightly sick.", "Thoda bimar mehsoos karna.", "I am feeling under the weather today."],
  ["Once in a blue moon", "Very rarely.", "Bahut kam ya kabhi-kabhi.", "He eats outside once in a blue moon."],
  ["Get the ball rolling", "To begin something.", "Kisi kaam ki shuruaat karna.", "Let's get the ball rolling on the new project."],
  ["A blessing in disguise", "Something that seems bad at first but becomes helpful later.", "Jo pehle bura lage lekin baad me faydemand nikle.", "Losing that job was a blessing in disguise."],
];

const intermediate = [
  ["Burn the midnight oil", "To work or study late into the night.", "Raat der tak kaam ya padhai karna.", "She burned the midnight oil to finish the presentation."],
  ["Cut corners", "To do something in a cheaper or easier but lower-quality way.", "Gunvatta kam karke kaam niptaana.", "We should not cut corners on client work."],
  ["Back to square one", "To start again from the beginning.", "Phir se shuruaat par aana.", "The rejected design sent us back to square one."],
  ["Miss the boat", "To miss an opportunity.", "Mauka gawa dena.", "Apply early, or you may miss the boat."],
  ["Bite off more than you can chew", "To take on more work than you can handle.", "Apni capacity se zyada kaam lena.", "He bit off more than he could chew with three projects."],
  ["Pull someone's leg", "To joke with someone.", "Mazak karna.", "Relax, I was only pulling your leg."],
  ["By the book", "According to rules and procedures.", "Niyamon ke hisaab se.", "The manager wants everything done by the book."],
  ["Keep an eye on", "To watch something carefully.", "Dhyan rakhna.", "Please keep an eye on the delivery status."],
  ["Go the extra mile", "To put in more effort than expected.", "Umeed se zyada mehnat karna.", "She always goes the extra mile for her clients."],
  ["Learn the ropes", "To learn how something works.", "Kaam ka tareeka seekhna.", "It took him a week to learn the ropes in the new office."],
];

const advanced = [
  ["The ball is in your court", "It is your turn to take action or make a decision.", "Ab faisla ya action aapko lena hai.", "I shared the proposal, so the ball is now in your court."],
  ["Read the room", "To understand the mood of the people around you.", "Mahaul samajhna.", "A good presenter knows how to read the room."],
  ["Move the needle", "To make a meaningful difference.", "Asar daalna ya real progress karna.", "This training will move the needle only if we practice daily."],
  ["Raise the bar", "To set a higher standard.", "Maanak aur uncha kar dena.", "Her performance raised the bar for the whole team."],
  ["Think on your feet", "To react quickly and intelligently.", "Turant soch samajh kar jawab dena.", "Interviewers value candidates who can think on their feet."],
  ["Get your ducks in a row", "To organize everything properly.", "Sab kuch sahi tarah se taiyar karna.", "Get your ducks in a row before the client call."],
  ["Open a can of worms", "To create many unexpected problems.", "Anjaane me kai problems khadi kar dena.", "Changing the scope now may open a can of worms."],
  ["Ahead of the curve", "More advanced than others.", "Dusron se aage hona.", "Staying consistent keeps you ahead of the curve."],
  ["Touch base", "To make brief contact or reconnect.", "Chhoti si baat karke update lena.", "Let's touch base tomorrow after the review."],
  ["In the loop", "Included and informed.", "Jaankari me shamil hona.", "Keep the design team in the loop."],
];

module.exports = {
  async up(queryInterface) {
    const rows = [
      ...createRows("simple", simple.map(([idiom, meaning, meaningHi, example]) => ({ idiom, meaning, meaningHi, example }))),
      ...createRows("intermediate", intermediate.map(([idiom, meaning, meaningHi, example]) => ({ idiom, meaning, meaningHi, example }))),
      ...createRows("advanced", advanced.map(([idiom, meaning, meaningHi, example]) => ({ idiom, meaning, meaningHi, example }))),
    ];

    await queryInterface.bulkDelete("english_idioms", null, {});
    await queryInterface.bulkInsert("english_idioms", rows, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("english_idioms", null, {});
  },
};
