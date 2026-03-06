const { Model } = require("sequelize");

class Conversation extends Model {
  static initModel(sequelize, DataTypes) {
    Conversation.init(
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
        userMessage: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: "user_message",
        },
        aiCorrection: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: "ai_correction",
        },
        aiExplanation: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: "ai_explanation",
        },
        aiNextQuestion: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: "ai_next_question",
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: "created_at",
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: "Conversation",
        tableName: "conversations",
        underscored: true,
        updatedAt: false,
      }
    );

    return Conversation;
  }

  static associate(models) {
    Conversation.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  }
}

module.exports = Conversation;
