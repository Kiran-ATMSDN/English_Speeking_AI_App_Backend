const { Model } = require("sequelize");

class EnglishIdiom extends Model {
  static initModel(sequelize, DataTypes) {
    EnglishIdiom.init(
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
        idiom: {
          type: DataTypes.STRING(140),
          allowNull: false,
        },
        meaning: {
          type: DataTypes.TEXT,
          allowNull: false,
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
        modelName: "EnglishIdiom",
        tableName: "english_idioms",
        underscored: true,
      }
    );

    return EnglishIdiom;
  }
}

module.exports = EnglishIdiom;
