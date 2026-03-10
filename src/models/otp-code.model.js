const { Model } = require("sequelize");

class OtpCode extends Model {
  static initModel(sequelize, DataTypes) {
    OtpCode.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        userId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: "user_id",
        },
        otpCode: {
          type: DataTypes.STRING(6),
          allowNull: false,
          field: "otp_code",
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: "expires_at",
        },
        isUsed: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: "is_used",
        },
        otpPurpose: {
          type: DataTypes.STRING(40),
          allowNull: false,
          defaultValue: "mobile_verification",
          field: "otp_purpose",
        },
        sentToNumber: {
          type: DataTypes.STRING(15),
          allowNull: true,
          field: "sent_to_number",
        },
        sentToEmail: {
          type: DataTypes.STRING(160),
          allowNull: true,
          field: "sent_to_email",
        },
      },
      {
        sequelize,
        modelName: "OtpCode",
        tableName: "otp_codes",
        underscored: true,
      }
    );

    return OtpCode;
  }

  static associate(models) {
    OtpCode.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  }
}

module.exports = OtpCode;
