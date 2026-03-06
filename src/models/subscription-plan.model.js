const { Model } = require("sequelize");

class SubscriptionPlan extends Model {
  static initModel(sequelize, DataTypes) {
    SubscriptionPlan.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true,
        },
        priceInr: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0,
          field: "price_inr",
        },
        billingCycle: {
          type: DataTypes.STRING(20),
          allowNull: false,
          defaultValue: "monthly",
          field: "billing_cycle",
        },
        benefitSummary: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: "benefit_summary",
        },
        featureList: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: "feature_list",
        },
        isHighlighted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: "is_highlighted",
        },
      },
      {
        sequelize,
        modelName: "SubscriptionPlan",
        tableName: "subscription_plans",
        underscored: true,
      }
    );

    return SubscriptionPlan;
  }

  static associate(models) {
    SubscriptionPlan.hasMany(models.User, {
      foreignKey: "subscription_plan_id",
      as: "users",
    });
  }
}

module.exports = SubscriptionPlan;
