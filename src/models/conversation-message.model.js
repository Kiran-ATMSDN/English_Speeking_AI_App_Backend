const { Model } = require("sequelize");

class ConversationMessage extends Model {
  static initModel(sequelize, DataTypes) {
    ConversationMessage.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        sessionId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: "session_id",
        },
        role: {
          type: DataTypes.STRING(20),
          allowNull: false,
          validate: {
            isIn: [["user", "assistant"]],
          },
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: false,
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
        modelName: "ConversationMessage",
        tableName: "conversation_messages",
        underscored: true,
        updatedAt: false,
      }
    );

    return ConversationMessage;
  }

  static associate(models) {
    ConversationMessage.belongsTo(models.ConversationSession, {
      foreignKey: "session_id",
      as: "session",
    });
  }
}

module.exports = ConversationMessage;
