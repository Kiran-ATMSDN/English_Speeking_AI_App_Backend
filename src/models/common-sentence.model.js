const { Model } = require("sequelize");

class CommonSentence extends Model {
  static initModel(sequelize, DataTypes) {
    CommonSentence.init(
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
        sentence: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        meaningHi: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: "meaning_hi",
        },
        usageTip: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: "usage_tip",
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
        modelName: "CommonSentence",
        tableName: "common_sentences",
        underscored: true,
      }
    );

    return CommonSentence;
  }
}

module.exports = CommonSentence;
