const { Model } = require("sequelize");

class GrammarLesson extends Model {
  static initModel(sequelize, DataTypes) {
    GrammarLesson.init(
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
          type: DataTypes.STRING(140),
          allowNull: false,
        },
        explanation: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        formula: {
          type: DataTypes.STRING(200),
          allowNull: true,
        },
        examples: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
        },
      },
      {
        sequelize,
        modelName: "GrammarLesson",
        tableName: "grammar_lessons",
        underscored: true,
      }
    );

    return GrammarLesson;
  }
}

module.exports = GrammarLesson;
