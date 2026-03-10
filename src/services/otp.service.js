const { OtpCode } = require("../models");
const { generateOtp } = require("../utils/otpGenerator");

function getOtpExpiryDate() {
  const minutes = Number(process.env.OTP_EXPIRY_MINUTES || 5);
  return new Date(Date.now() + minutes * 60 * 1000);
}

async function createAndStoreOtp({ userId, sentToNumber = null, sentToEmail = null, otpPurpose = "mobile_verification" }) {
  await OtpCode.update(
    { isUsed: true },
    {
      where: {
        userId,
        isUsed: false,
        otpPurpose,
      },
    }
  );

  const otp = generateOtp(6);
  const expiresAt = getOtpExpiryDate();

  await OtpCode.create({
    userId,
    otpCode: otp,
    expiresAt,
    otpPurpose,
    sentToNumber,
    sentToEmail,
  });

  return { otp, expiresAt };
}

module.exports = {
  createAndStoreOtp,
};
