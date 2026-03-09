"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("conversation_scripts", {
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
        type: Sequelize.STRING(160),
        allowNull: false,
      },
      context: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      lines: {
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

    await queryInterface.addIndex("conversation_scripts", ["day_number"], { unique: true });
    await queryInterface.addIndex("conversation_scripts", ["level"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("conversation_scripts");
  },
};
