"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "full_name", {
      type: Sequelize.STRING(120),
      allowNull: true,
    });

    await queryInterface.addColumn("users", "email", {
      type: Sequelize.STRING(120),
      allowNull: true,
      unique: true,
    });

    await queryInterface.sequelize.query(`
      UPDATE users
      SET full_name = COALESCE(full_name, 'User')
      WHERE full_name IS NULL;
    `);

    await queryInterface.changeColumn("users", "full_name", {
      type: Sequelize.STRING(120),
      allowNull: false,
    });

    await queryInterface.changeColumn("users", "is_mobile_verified", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "is_mobile_verified", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.removeColumn("users", "email");
    await queryInterface.removeColumn("users", "full_name");
  },
};
