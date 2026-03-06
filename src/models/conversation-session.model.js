const { Model } = require("sequelize");

class ConversationSession extends Model {
  static initModel(sequelize, DataTypes) {
    ConversationSession.init(
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
        startedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: "started_at",
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: "ConversationSession",
        tableName: "conversation_sessions",
        underscored: true,
        timestamps: false,
      }
    );

    return ConversationSession;
  }

  static associate(models) {
    ConversationSession.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });

    ConversationSession.hasMany(models.ConversationMessage, {
      foreignKey: "session_id",
      as: "messages",
    });
  }
}

module.exports = ConversationSession;
