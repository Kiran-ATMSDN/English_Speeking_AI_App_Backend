const { Model } = require("sequelize");

class User extends Model {
  static initModel(sequelize, DataTypes) {
    User.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        fullName: {
          type: DataTypes.STRING(120),
          allowNull: false,
          field: "full_name",
        },
        email: {
          type: DataTypes.STRING(120),
          allowNull: true,
          unique: true,
          field: "email",
          validate: {
            isEmail: true,
          },
        },
        passwordHash: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "password_hash",
        },
        mobileNumber: {
          type: DataTypes.STRING(15),
          allowNull: false,
          unique: true,
          field: "mobile_number",
          validate: {
            len: [10, 15],
          },
        },
        countryCode: {
          type: DataTypes.STRING(8),
          allowNull: false,
          defaultValue: "+91",
          field: "country_code",
        },
        isMobileVerified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: "is_mobile_verified",
        },
        learningPurpose: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: "learning_purpose",
        },
        onboardingCompleted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: "onboarding_completed",
        },
        subscriptionPlanId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          field: "subscription_plan_id",
        },
      },
      {
        sequelize,
        modelName: "User",
        tableName: "users",
        underscored: true,
      }
    );

    return User;
  }

  static associate(models) {
    User.hasMany(models.OtpCode, {
      foreignKey: "user_id",
      as: "otpCodes",
    });

    User.belongsTo(models.SubscriptionPlan, {
      foreignKey: "subscription_plan_id",
      as: "subscriptionPlan",
    });

    User.hasMany(models.UserOnboardingAnswer, {
      foreignKey: "user_id",
      as: "onboardingAnswers",
    });

    User.hasMany(models.Conversation, {
      foreignKey: "user_id",
      as: "mentorConversations",
    });

    User.hasMany(models.ConversationSession, {
      foreignKey: "user_id",
      as: "conversationSessions",
    });
  }
}

module.exports = User;
