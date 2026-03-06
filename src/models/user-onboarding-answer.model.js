const { Model } = require("sequelize");

class UserOnboardingAnswer extends Model {
  static initModel(sequelize, DataTypes) {
    UserOnboardingAnswer.init(
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
        questionKey: {
          type: DataTypes.STRING(60),
          allowNull: false,
          field: "question_key",
        },
        questionText: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: "question_text",
        },
        answerText: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: "answer_text",
        },
      },
      {
        sequelize,
        modelName: "UserOnboardingAnswer",
        tableName: "user_onboarding_answers",
        underscored: true,
      }
    );

    return UserOnboardingAnswer;
  }

  static associate(models) {
    UserOnboardingAnswer.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  }
}

module.exports = UserOnboardingAnswer;
