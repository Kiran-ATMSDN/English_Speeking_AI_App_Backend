"use strict";

function add(rows, level, title, guide, example) {
  rows.push({ level, title, guide, example });
}

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const rows = [];
    const table = { tableName: "pronunciation_tips", schema: "public" };

    add(rows, "simple", "TH sound", "Place tongue lightly between teeth and push air.", "think, thank, this, that");
    add(rows, "simple", "V vs W", "V uses upper teeth on lower lip. W uses rounded lips.", "vine vs wine");
    add(rows, "simple", "S vs SH", "S has flat lips; SH has slightly rounded lips.", "sip vs ship");
    add(rows, "simple", "Ending sounds", "Do not drop final consonants at word end.", "want, ask, help");
    add(rows, "simple", "Word stress", "Stress one syllable clearly in multi-syllable words.", "TAble, imPORtant");
    add(rows, "simple", "Long vs short vowel", "Long vowels are stretched, short vowels are quick.", "ship vs sheep");
    add(rows, "simple", "P vs F", "P is air burst with closed lips; F is teeth-lip friction.", "pat vs fat");
    add(rows, "simple", "B vs V", "B uses both lips, V uses teeth and lip.", "berry vs very");
    add(rows, "simple", "R sound", "Curl tongue slightly, do not touch roof fully.", "red, right, around");
    add(rows, "simple", "L sound", "Touch tongue tip behind upper teeth gently.", "light, little, allow");

    add(rows, "intermediate", "Sentence stress", "Stress content words, reduce helper words.", "I WANT to IMPROVE my ENGLISH.");
    add(rows, "intermediate", "Linking words", "Connect final sound to next word smoothly.", "pick_it_up, turn_off");
    add(rows, "intermediate", "Intonation rising", "Raise pitch in yes/no questions.", "Are you READY?");
    add(rows, "intermediate", "Intonation falling", "Lower pitch in complete statements.", "I finished the WORK.");
    add(rows, "intermediate", "T flap (American)", "T between vowels may sound like soft d.", "water, better");
    add(rows, "intermediate", "Weak forms", "Pronounce function words lightly in natural speech.", "to, for, of");
    add(rows, "intermediate", "Consonant clusters", "Pronounce every consonant clearly in cluster.", "texts, world");
    add(rows, "intermediate", "Schwa sound", "Use relaxed neutral vowel in unstressed syllables.", "about, problem");
    add(rows, "intermediate", "Thought groups", "Pause naturally in meaning groups.", "After lunch / we had a meeting.");
    add(rows, "intermediate", "Pace control", "Speak slower first, then increase speed with clarity.", "short daily drills");

    add(rows, "advanced", "Contrastive stress", "Stress changing word to shift meaning emphasis.", "I asked for RED, not blue.");
    add(rows, "advanced", "Connected speech reduction", "Reduce sounds naturally in fast speech.", "want to -> wanna");
    add(rows, "advanced", "Assimilation", "Nearby sounds influence each other.", "good boy -> goob boy");
    add(rows, "advanced", "Elision", "Some sounds disappear in fast fluent speech.", "next day -> nex day");
    add(rows, "advanced", "Pitch variation", "Use pitch range to sound expressive and natural.", "presentation delivery");
    add(rows, "advanced", "Pausing for impact", "Use meaningful pauses for clarity and confidence.", "public speaking");
    add(rows, "advanced", "Rhythm timing", "English is stress-timed; keep rhythm on stressed words.", "content-word rhythm");
    add(rows, "advanced", "Formal tone pronunciation", "Use precise articulation in professional contexts.", "client communication");
    add(rows, "advanced", "Minimal pair drills", "Practice pairs daily to train hearing and speech.", "live/leave, full/fool");
    add(rows, "advanced", "Self-monitoring loop", "Record, compare, and correct your pronunciation weekly.", "track improvement");

    const enriched = rows.map((row, i) => ({
      ...row,
      sort_order: i + 1,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkDelete(table, null, {});
    await queryInterface.bulkInsert(table, enriched, {});
  },

  async down(queryInterface) {
    const table = { tableName: "pronunciation_tips", schema: "public" };
    await queryInterface.bulkDelete(table, null, {});
  },
};
