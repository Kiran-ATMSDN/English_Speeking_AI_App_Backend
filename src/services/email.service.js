const axios = require("axios");

async function sendOtpEmail({ toEmail, fullName, otp, expiresAt }) {
  const fromEmail = process.env.MAIL_FROM_EMAIL;
  const fromName = process.env.MAIL_FROM_NAME || "English Speaking AI";
  const brevoApiKey = process.env.BREVO_API_KEY;

  if (!fromEmail || !brevoApiKey) {
    return {
      delivered: false,
      previewMessage: `Email provider is not configured. Use OTP ${otp} before ${new Date(expiresAt).toLocaleString()}.`,
    };
  }

  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: { email: fromEmail, name: fromName },
      to: [{ email: toEmail, name: fullName || "User" }],
      subject: "Your password reset OTP",
      htmlContent: `
        <div style="font-family:Arial,sans-serif;padding:16px;color:#18322d">
          <h2 style="margin:0 0 12px">Password Reset OTP</h2>
          <p style="margin:0 0 10px">Use the OTP below to reset your password.</p>
          <div style="font-size:28px;font-weight:700;letter-spacing:6px;margin:14px 0;color:#2a8d7b">${otp}</div>
          <p style="margin:0">This code expires at ${new Date(expiresAt).toLocaleString()}.</p>
        </div>
      `,
    },
    {
      headers: {
        "api-key": brevoApiKey,
        "content-type": "application/json",
      },
    }
  );

  return { delivered: true };
}

module.exports = {
  sendOtpEmail,
};
