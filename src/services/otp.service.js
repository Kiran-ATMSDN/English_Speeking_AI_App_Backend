const { OtpCode } = require("../models");
const { generateOtp } = require("../utils/otpGenerator");

function getOtpExpiryDate() {
  const minutes = Number(process.env.OTP_EXPIRY_MINUTES || 5);
  return new Date(Date.now() + minutes * 60 * 1000);
}

async function createAndStoreOtp(userId, sentToNumber) {
  await OtpCode.update(
    { isUsed: true },
    {
      where: {
        userId,
        isUsed: false,
      },
    }
  );

  const otp = generateOtp(6);
  const expiresAt = getOtpExpiryDate();

  await OtpCode.create({
    userId,
    otpCode: otp,
    expiresAt,
    sentToNumber,
  });

  return { otp, expiresAt };
}

module.exports = {
  createAndStoreOtp,
};
