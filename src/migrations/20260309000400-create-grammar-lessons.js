"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("grammar_lessons", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
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
      title: {
        type: Sequelize.STRING(140),
        allowNull: false,
      },
      explanation: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      formula: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      examples: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
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

    await queryInterface.addIndex("grammar_lessons", ["day_number"], {
      unique: true,
    });
    await queryInterface.addIndex("grammar_lessons", ["level"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("grammar_lessons");
  },
};
