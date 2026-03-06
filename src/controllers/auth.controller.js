const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { User, OtpCode } = require("../models");
const { createAndStoreOtp } = require("../services/otp.service");

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

async function signup(req, res) {
  try {
    const fullName = String(req.body.fullName || "").trim();
    const email = req.body.email ? String(req.body.email).trim().toLowerCase() : null;
    const mobileNumber = normalizeMobileNumber(req.body.mobileNumber);
    const countryCode = req.body.countryCode || "+91";

    if (!fullName) {
      return res.status(400).json({ message: "fullName is required." });
    }

    if (!isValidMobileNumber(mobileNumber)) {
      return res.status(400).json({
        message: "Please provide a valid mobileNumber (10 to 15 digits).",
      });
    }

    const existingUser = await User.findOne({
      where: { mobileNumber },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this mobile number. Please login.",
      });
    }

    const user = await User.create({
      fullName,
      email,
      mobileNumber,
      countryCode,
      isMobileVerified: true,
    });

    const token = buildToken(user);

    return res.status(201).json({
      message: "Signup successful.",
      token,
      user: buildUserPayload(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Signup failed.", error: error.message });
  }
}

async function login(req, res) {
  try {
    const mobileNumber = normalizeMobileNumber(req.body.mobileNumber);

    if (!isValidMobileNumber(mobileNumber)) {
      return res.status(400).json({
        message: "Please provide a valid mobileNumber (10 to 15 digits).",
      });
    }

    const user = await User.findOne({
      where: { mobileNumber },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found. Please signup first." });
    }

    const token = buildToken(user);

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: buildUserPayload(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed.", error: error.message });
  }
}

async function sendOtp(req, res) {
  try {
    const mobileNumber = normalizeMobileNumber(req.body.mobileNumber);
    const countryCode = req.body.countryCode || "+91";

    if (!isValidMobileNumber(mobileNumber)) {
      return res.status(400).json({
        message: "Please provide a valid mobileNumber (10 to 15 digits).",
      });
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

    const { otp, expiresAt } = await createAndStoreOtp(user.id, mobileNumber);

    return res.status(200).json({
      message: "OTP sent successfully.",
      mobileNumber,
      expiresAt,
      ...(process.env.NODE_ENV !== "production" ? { otp } : {}),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to send OTP.", error: error.message });
  }
}

async function verifyOtp(req, res) {
  try {
    const mobileNumber = normalizeMobileNumber(req.body.mobileNumber);
    const otp = String(req.body.otp || "").trim();

    if (!isValidMobileNumber(mobileNumber) || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        message: "Invalid mobileNumber or otp format.",
      });
    }

    const user = await User.findOne({ where: { mobileNumber } });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please signup first." });
    }

    const otpRecord = await OtpCode.findOne({
      where: {
        userId: user.id,
        sentToNumber: mobileNumber,
        otpCode: otp,
        isUsed: false,
        expiresAt: { [Op.gt]: new Date() },
      },
      order: [["createdAt", "DESC"]],
    });

    if (!otpRecord) {
      return res.status(401).json({ message: "Invalid or expired OTP." });
    }

    await otpRecord.update({ isUsed: true });
    await user.update({ isMobileVerified: true });

    const token = buildToken(user);
    const refreshedUser = await User.findByPk(user.id);

    return res.status(200).json({
      message: "OTP verified successfully.",
      token,
      user: buildUserPayload(refreshedUser),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to verify OTP.", error: error.message });
  }
}

module.exports = {
  signup,
  login,
  sendOtp,
  verifyOtp,
};
