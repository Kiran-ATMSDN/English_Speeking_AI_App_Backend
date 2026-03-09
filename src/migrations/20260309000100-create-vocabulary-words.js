"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("vocabulary_words", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      level: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      word: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      meaning_en: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      meaning_hi: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      example: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("vocabulary_words", ["level"]);
    await queryInterface.addIndex("vocabulary_words", ["level", "sort_order"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("vocabulary_words");
  },
};
