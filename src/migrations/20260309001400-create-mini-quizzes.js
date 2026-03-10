"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mini_quizzes", {
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
      question: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      options: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      correct_answer_index: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      explanation: {
        type: Sequelize.TEXT,
        allowNull: false,
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
    await queryInterface.dropTable("mini_quizzes");
  },
};
