"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("conversations", {
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
      user_message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      ai_correction: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      ai_explanation: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      ai_next_question: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("conversations", ["user_id"]);
    await queryInterface.addIndex("conversations", ["created_at"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("conversations");
  },
};
