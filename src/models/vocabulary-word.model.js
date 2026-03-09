const { Model } = require("sequelize");

class VocabularyWord extends Model {
  static initModel(sequelize, DataTypes) {
    VocabularyWord.init(
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
        word: {
          type: DataTypes.STRING(120),
          allowNull: false,
        },
        meaningEn: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: "meaning_en",
        },
        meaningHi: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: "meaning_hi",
        },
        example: {
          type: DataTypes.TEXT,
          allowNull: false,
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
        modelName: "VocabularyWord",
        tableName: "vocabulary_words",
        underscored: true,
      }
    );

    return VocabularyWord;
  }
}

module.exports = VocabularyWord;
