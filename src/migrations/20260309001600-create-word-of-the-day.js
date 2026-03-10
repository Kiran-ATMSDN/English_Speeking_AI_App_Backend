"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("word_of_the_day", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      day_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      level: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      word: {
        type: Sequelize.STRING(140),
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
      tip: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("word_of_the_day");
  },
};
