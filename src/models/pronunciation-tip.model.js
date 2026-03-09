const { Model } = require("sequelize");

class PronunciationTip extends Model {
  static initModel(sequelize, DataTypes) {
    PronunciationTip.init(
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
          type: DataTypes.STRING(120),
          allowNull: false,
        },
        guide: {
          type: DataTypes.TEXT,
          allowNull: false,
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
        modelName: "PronunciationTip",
        tableName: "pronunciation_tips",
        underscored: true,
      }
    );

    return PronunciationTip;
  }
}

module.exports = PronunciationTip;
