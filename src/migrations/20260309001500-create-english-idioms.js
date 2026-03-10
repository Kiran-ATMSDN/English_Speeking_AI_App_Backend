"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("english_idioms", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      level: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      idiom: {
        type: Sequelize.STRING(140),
        allowNull: false,
      },
      meaning: {
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
    await queryInterface.dropTable("english_idioms");
  },
};
