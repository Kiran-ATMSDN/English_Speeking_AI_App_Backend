"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "password_hash", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn("otp_codes", "sent_to_number", {
      type: Sequelize.STRING(15),
      allowNull: true,
    });

    await queryInterface.addColumn("otp_codes", "sent_to_email", {
      type: Sequelize.STRING(160),
      allowNull: true,
    });

    await queryInterface.addColumn("otp_codes", "otp_purpose", {
      type: Sequelize.STRING(40),
      allowNull: false,
      defaultValue: "mobile_verification",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("otp_codes", "otp_purpose");
    await queryInterface.removeColumn("otp_codes", "sent_to_email");
    await queryInterface.changeColumn("otp_codes", "sent_to_number", {
      type: Sequelize.STRING(15),
      allowNull: false,
    });
    await queryInterface.removeColumn("users", "password_hash");
  },
};
