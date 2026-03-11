const axios = require("axios");
const nodemailer = require("nodemailer");

function buildOtpEmailHtml(otp, expiresAt) {
  return `
    <div style="font-family:Arial,sans-serif;padding:16px;color:#18322d">
      <h2 style="margin:0 0 12px">Password Reset OTP</h2>
      <p style="margin:0 0 10px">Use the OTP below to reset your password.</p>
      <div style="font-size:28px;font-weight:700;letter-spacing:6px;margin:14px 0;color:#2a8d7b">${otp}</div>
      <p style="margin:0">This code expires at ${new Date(expiresAt).toLocaleString()}.</p>
    </div>
  `;
}

function getMailConfig() {
  const smtpUser = process.env.SMTP_USER;

  return {
    fromEmail: process.env.MAIL_FROM_EMAIL || smtpUser,
    fromName: process.env.MAIL_FROM_NAME || "English Speaking AI",
    brevoApiKey: process.env.BREVO_API_KEY,
    smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
    smtpPort: Number(process.env.SMTP_PORT || 587),
    smtpSecure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
    smtpUser,
    smtpPass: process.env.SMTP_PASS,
  };
}

async function sendWithSmtp({ toEmail, fullName, otp, expiresAt, config }) {
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });

  await transporter.sendMail({
    from: `"${config.fromName}" <${config.fromEmail}>`,
    to: `"${fullName || "User"}" <${toEmail}>`,
    subject: "Your password reset OTP",
    text: `Your OTP is ${otp}. It expires at ${new Date(expiresAt).toLocaleString()}.`,
    html: buildOtpEmailHtml(otp, expiresAt),
  });

  return { delivered: true, provider: "smtp" };
}

async function sendWithBrevo({ toEmail, fullName, otp, expiresAt, config }) {
  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: { email: config.fromEmail, name: config.fromName },
      to: [{ email: toEmail, name: fullName || "User" }],
      subject: "Your password reset OTP",
      htmlContent: buildOtpEmailHtml(otp, expiresAt),
    },
    {
      headers: {
        "api-key": config.brevoApiKey,
        "content-type": "application/json",
      },
    }
  );

  return { delivered: true, provider: "brevo" };
}

async function sendOtpEmail({ toEmail, fullName, otp, expiresAt }) {
  const config = getMailConfig();

  if (config.fromEmail && config.smtpUser && config.smtpPass) {
    return sendWithSmtp({ toEmail, fullName, otp, expiresAt, config });
  }

  if (config.fromEmail && config.brevoApiKey) {
    return sendWithBrevo({ toEmail, fullName, otp, expiresAt, config });
  }

  return {
    delivered: false,
    previewMessage: `Email provider is not configured. Set SMTP_USER and SMTP_PASS, or use BREVO_API_KEY. OTP ${otp} expires at ${new Date(expiresAt).toLocaleString()}.`,
  };
}

module.exports = {
  sendOtpEmail,
};
