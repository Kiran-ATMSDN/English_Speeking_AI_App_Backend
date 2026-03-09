const { Model } = require("sequelize");

class ConversationScript extends Model {
  static initModel(sequelize, DataTypes) {
    ConversationScript.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        dayNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: true,
          field: "day_number",
        },
        level: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING(160),
          allowNull: false,
        },
        context: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        lines: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
        },
      },
      {
        sequelize,
        modelName: "ConversationScript",
        tableName: "conversation_scripts",
        underscored: true,
      }
    );

    return ConversationScript;
  }
}

module.exports = ConversationScript;
