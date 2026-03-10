const { Model } = require("sequelize");

class WordOfTheDay extends Model {
  static initModel(sequelize, DataTypes) {
    WordOfTheDay.init(
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
        word: {
          type: DataTypes.STRING(140),
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
        tip: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "WordOfTheDay",
        tableName: "word_of_the_day",
        underscored: true,
      }
    );

    return WordOfTheDay;
  }
}

module.exports = WordOfTheDay;
