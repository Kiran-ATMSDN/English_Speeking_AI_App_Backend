const { Model } = require("sequelize");

class MotivationalMessage extends Model {
  static initModel(sequelize, DataTypes) {
    MotivationalMessage.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        level: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING(140),
          allowNull: false,
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        takeaway: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        sortOrder: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          field: "sort_order",
        },
      },
      {
        sequelize,
        modelName: "MotivationalMessage",
        tableName: "motivational_messages",
        underscored: true,
      }
    );

    return MotivationalMessage;
  }
}

module.exports = MotivationalMessage;
