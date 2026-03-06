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
      return res.error("fullName is required.", 400);
    }

    if (!isValidMobileNumber(mobileNumber)) {
      return res.error("Please provide a valid mobileNumber (10 to 15 digits).", 400);
    }

    const existingUser = await User.findOne({
      where: { mobileNumber },
    });

    if (existingUser) {
      return res.error("User already exists with this mobile number. Please login.", 409);
    }

    const user = await User.create({
      fullName,
      email,
      mobileNumber,
      countryCode,
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
    const mobileNumber = normalizeMobileNumber(req.body.mobileNumber);

    if (!isValidMobileNumber(mobileNumber)) {
      return res.error("Please provide a valid mobileNumber (10 to 15 digits).", 400);
    }

    const user = await User.findOne({
      where: { mobileNumber },
    });

    if (!user) {
      return res.error("User not found. Please signup first.", 404);
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

    const { otp, expiresAt } = await createAndStoreOtp(user.id, mobileNumber);

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

module.exports = {
  signup,
  login,
  sendOtp,
  verifyOtp,
};
