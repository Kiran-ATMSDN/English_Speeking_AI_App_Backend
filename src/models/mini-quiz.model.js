const { Model } = require("sequelize");

class MiniQuiz extends Model {
  static initModel(sequelize, DataTypes) {
    MiniQuiz.init(
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
        question: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        options: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        correctAnswerIndex: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "correct_answer_index",
        },
        explanation: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "MiniQuiz",
        tableName: "mini_quizzes",
        underscored: true,
      }
    );

    return MiniQuiz;
  }
}

module.exports = MiniQuiz;
