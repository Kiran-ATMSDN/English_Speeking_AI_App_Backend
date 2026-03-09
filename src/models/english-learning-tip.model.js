const { Model } = require("sequelize");

class EnglishLearningTip extends Model {
  static initModel(sequelize, DataTypes) {
    EnglishLearningTip.init(
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
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        actionStep: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: "action_step",
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
        modelName: "EnglishLearningTip",
        tableName: "english_learning_tips",
        underscored: true,
      }
    );

    return EnglishLearningTip;
  }
}

module.exports = EnglishLearningTip;
