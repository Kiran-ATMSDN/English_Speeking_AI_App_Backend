const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { User, OtpCode } = require("../models");
const { createAndStoreOtp } = require("../services/otp.service");
const { sendOtpEmail } = require("../services/email.service");

function normalizeMobileNumber(value = "") {
  return String(value).replace(/\D/g, "");
}

function isValidMobileNumber(value = "") {
  return /^\d{10,15}$/.test(value);
}

function buildToken(user) {
  return jwt.sign(
    { userId: user.id, mobileNumber: user.mobileNumber },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "7d" }
  );
}

function buildUserPayload(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    mobileNumber: user.mobileNumber,
    countryCode: user.countryCode,
    isMobileVerified: user.isMobileVerified,
  };
}

function normalizeEmail(value = "") {
  return String(value || "").trim().toLowerCase();
}

function isValidEmail(value = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPassword(value = "") {
  return String(value || "").trim().length >= 6;
}

async function signup(req, res) {
  try {
    const fullName = String(req.body.fullName || "").trim();
    const email = normalizeEmail(req.body.email);
    const mobileNumber = normalizeMobileNumber(req.body.mobileNumber);
    const countryCode = req.body.countryCode || "+91";
    const password = String(req.body.password || "");

    if (!fullName) {
      return res.error("fullName is required.", 400);
    }

    if (!isValidEmail(email)) {
      return res.error("Please provide a valid email address.", 400);
    }

    if (!isValidPassword(password)) {
      return res.error("Password must be at least 6 characters.", 400);
    }

    if (!isValidMobileNumber(mobileNumber)) {
      return res.error("Please provide a valid mobileNumber (10 to 15 digits).", 400);
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ mobileNumber }, { email }],
      },
    });

    if (existingUser) {
      return res.error("User already exists with this email or mobile number. Please login.", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      mobileNumber,
      countryCode,
      passwordHash,
      isMobileVerified: true,
    });

    const token = buildToken(user);

    return res.success(
      "Signup successful.",
      {
        token,
        user: buildUserPayload(user),
      },
      201
    );
  } catch (error) {
    return res.error("Signup failed.", 500, error.message);
  }
}

async function login(req, res) {
  try {
    const loginId = String(req.body.loginId || req.body.email || req.body.mobileNumber || "").trim();
    const password = String(req.body.password || "");

    if (!password) {
      return res.error("Password is required.", 400);
    }

    const normalizedEmail = normalizeEmail(loginId);
    const normalizedMobile = normalizeMobileNumber(loginId);
    const lookupConditions = [];

    if (isValidEmail(normalizedEmail)) {
      lookupConditions.push({ email: normalizedEmail });
    }
    if (isValidMobileNumber(normalizedMobile)) {
      lookupConditions.push({ mobileNumber: normalizedMobile });
    }

    if (!lookupConditions.length) {
      return res.error("Please enter a valid email address or mobile number.", 400);
    }

    const user = await User.findOne({
      where: { [Op.or]: lookupConditions },
    });

    if (!user) {
      return res.error("User not found. Please signup first.", 404);
    }

    if (!user.passwordHash) {
      return res.error("Password is not set for this account. Please reset your password.", 400);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.error("Invalid login credentials.", 401);
    }

    const token = buildToken(user);

    return res.success("Login successful.", {
      token,
      user: buildUserPayload(user),
    });
  } catch (error) {
    return res.error("Login failed.", 500, error.message);
  }
}

async function sendOtp(req, res) {
  try {
    const mobileNumber = normalizeMobileNumber(req.body.mobileNumber);
    const countryCode = req.body.countryCode || "+91";

    if (!isValidMobileNumber(mobileNumber)) {
      return res.error("Please provide a valid mobileNumber (10 to 15 digits).", 400);
    }

    const [user] = await User.findOrCreate({
      where: { mobileNumber },
      defaults: {
        fullName: String(req.body.fullName || "User").trim(),
        email: req.body.email ? String(req.body.email).trim().toLowerCase() : null,
        mobileNumber,
        countryCode,
        isMobileVerified: false,
      },
    });

    const { otp, expiresAt } = await createAndStoreOtp({
      userId: user.id,
      sentToNumber: mobileNumber,
      otpPurpose: "mobile_verification",
    });

    return res.success("OTP sent successfully.", {
      mobileNumber,
      expiresAt,
      ...(process.env.NODE_ENV !== "production" ? { otp } : {}),
    });
  } catch (error) {
    return res.error("Failed to send OTP.", 500, error.message);
  }
}

async function verifyOtp(req, res) {
  try {
    const mobileNumber = normalizeMobileNumber(req.body.mobileNumber);
    const otp = String(req.body.otp || "").trim();

    if (!isValidMobileNumber(mobileNumber) || !/^\d{6}$/.test(otp)) {
      return res.error("Invalid mobileNumber or otp format.", 400);
    }

    const user = await User.findOne({ where: { mobileNumber } });
    if (!user) {
      return res.error("User not found. Please signup first.", 404);
    }

    const otpRecord = await OtpCode.findOne({
      where: {
        userId: user.id,
        sentToNumber: mobileNumber,
        otpCode: otp,
        otpPurpose: "mobile_verification",
        isUsed: false,
        expiresAt: { [Op.gt]: new Date() },
      },
      order: [["createdAt", "DESC"]],
    });

    if (!otpRecord) {
      return res.error("Invalid or expired OTP.", 401);
    }

    await otpRecord.update({ isUsed: true });
    await user.update({ isMobileVerified: true });

    const token = buildToken(user);
    const refreshedUser = await User.findByPk(user.id);

    return res.success("OTP verified successfully.", {
      token,
      user: buildUserPayload(refreshedUser),
    });
  } catch (error) {
    return res.error("Failed to verify OTP.", 500, error.message);
  }
}

async function requestPasswordReset(req, res) {
  try {
    const email = normalizeEmail(req.body.email);

    if (!isValidEmail(email)) {
      return res.error("Please provide a valid email address.", 400);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.error("User not found with this email address.", 404);
    }

    const { otp, expiresAt } = await createAndStoreOtp({
      userId: user.id,
      sentToEmail: email,
      otpPurpose: "password_reset",
    });

    const emailResult = await sendOtpEmail({
      toEmail: email,
      fullName: user.fullName,
      otp,
      expiresAt,
    });

    return res.success("Password reset OTP sent successfully.", {
      email,
      expiresAt,
      ...(emailResult.previewMessage ? { previewMessage: emailResult.previewMessage } : {}),
      ...(process.env.NODE_ENV !== "production" ? { otp } : {}),
    });
  } catch (error) {
    return res.error("Failed to send password reset OTP.", 500, error.message);
  }
}

async function resetPassword(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || "").trim();
    const password = String(req.body.password || "");

    if (!isValidEmail(email)) {
      return res.error("Please provide a valid email address.", 400);
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.error("OTP must be 6 digits.", 400);
    }

    if (!isValidPassword(password)) {
      return res.error("Password must be at least 6 characters.", 400);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.error("User not found with this email address.", 404);
    }

    const otpRecord = await OtpCode.findOne({
      where: {
        userId: user.id,
        sentToEmail: email,
        otpCode: otp,
        otpPurpose: "password_reset",
        isUsed: false,
        expiresAt: { [Op.gt]: new Date() },
      },
      order: [["createdAt", "DESC"]],
    });

    if (!otpRecord) {
      return res.error("Invalid or expired OTP.", 401);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await user.update({ passwordHash });
    await otpRecord.update({ isUsed: true });

    return res.success("Password reset successful.", { email });
  } catch (error) {
    return res.error("Failed to reset password.", 500, error.message);
  }
}

module.exports = {
  signup,
  login,
  sendOtp,
  verifyOtp,
  requestPasswordReset,
  resetPassword,
};
