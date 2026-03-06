"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_onboarding_answers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      question_key: {
        type: Sequelize.STRING(60),
        allowNull: false,
      },
      question_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      answer_text: {
        type: Sequelize.TEXT,
        allowNull: false,
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

    await queryInterface.addIndex("user_onboarding_answers", ["user_id"]);
    await queryInterface.addIndex("user_onboarding_answers", [
      "user_id",
      "question_key",
    ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("user_onboarding_answers");
  },
};
