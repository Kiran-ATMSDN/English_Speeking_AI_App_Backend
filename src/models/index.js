const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = require("./user.model");
const OtpCode = require("./otp-code.model");
const SubscriptionPlan = require("./subscription-plan.model");
const UserOnboardingAnswer = require("./user-onboarding-answer.model");

const models = {
  User: User.initModel(sequelize, DataTypes),
  OtpCode: OtpCode.initModel(sequelize, DataTypes),
  SubscriptionPlan: SubscriptionPlan.initModel(sequelize, DataTypes),
  UserOnboardingAnswer: UserOnboardingAnswer.initModel(sequelize, DataTypes),
};

Object.values(models).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});

module.exports = { sequelize, ...models };
