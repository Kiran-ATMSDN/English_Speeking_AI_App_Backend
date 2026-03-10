const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = require("./user.model");
const OtpCode = require("./otp-code.model");
const SubscriptionPlan = require("./subscription-plan.model");
const UserOnboardingAnswer = require("./user-onboarding-answer.model");
const Conversation = require("./conversation.model");
const ConversationSession = require("./conversation-session.model");
const ConversationMessage = require("./conversation-message.model");
const VocabularyWord = require("./vocabulary-word.model");
const GrammarLesson = require("./grammar-lesson.model");
const CommonSentence = require("./common-sentence.model");
const ConversationScript = require("./conversation-script.model");
const PronunciationTip = require("./pronunciation-tip.model");
const EnglishLearningTip = require("./english-learning-tip.model");

const models = {
  User: User.initModel(sequelize, DataTypes),
  OtpCode: OtpCode.initModel(sequelize, DataTypes),
  SubscriptionPlan: SubscriptionPlan.initModel(sequelize, DataTypes),
  UserOnboardingAnswer: UserOnboardingAnswer.initModel(sequelize, DataTypes),
  Conversation: Conversation.initModel(sequelize, DataTypes),
  ConversationSession: ConversationSession.initModel(sequelize, DataTypes),
  ConversationMessage: ConversationMessage.initModel(sequelize, DataTypes),
  VocabularyWord: VocabularyWord.initModel(sequelize, DataTypes),
  GrammarLesson: GrammarLesson.initModel(sequelize, DataTypes),
  CommonSentence: CommonSentence.initModel(sequelize, DataTypes),
  ConversationScript: ConversationScript.initModel(sequelize, DataTypes),
  PronunciationTip: PronunciationTip.initModel(sequelize, DataTypes),
  EnglishLearningTip: EnglishLearningTip.initModel(sequelize, DataTypes),
};

Object.values(models).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});

module.exports = { sequelize, ...models };
