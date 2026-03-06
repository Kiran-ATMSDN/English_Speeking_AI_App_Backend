const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const outputDir = path.join(process.cwd(), "docs");
const outputPath = path.join(outputDir, "Application-Flow-Guide.pdf");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const doc = new PDFDocument({
  size: "A4",
  margins: { top: 48, bottom: 48, left: 50, right: 50 },
});

doc.pipe(fs.createWriteStream(outputPath));

function title(text) {
  doc.moveDown(0.8);
  doc.font("Helvetica-Bold").fontSize(18).text(text);
  doc.moveDown(0.4);
}

function section(text) {
  doc.moveDown(0.5);
  doc.font("Helvetica-Bold").fontSize(13).text(text);
  doc.moveDown(0.2);
}

function p(text) {
  doc.font("Helvetica").fontSize(10.5).text(text, { lineGap: 2 });
}

function bullet(text) {
  doc.font("Helvetica").fontSize(10.5).text(`• ${text}`, { indent: 14, lineGap: 2 });
}

function endpoint(method, pathName, description) {
  doc.font("Helvetica-Bold").fontSize(10.5).text(`${method} ${pathName}`);
  doc.font("Helvetica").fontSize(10.5).text(description, { indent: 10 });
  doc.moveDown(0.2);
}

function codeBlock(text) {
  const x = doc.x;
  const y = doc.y;
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const pad = 8;
  const height = doc.heightOfString(text, {
    width: width - pad * 2,
    lineGap: 1,
  }) + pad * 2;

  doc.save();
  doc.rect(x, y, width, height).fill("#F5F7FA");
  doc.restore();
  doc.font("Courier").fontSize(9.5).fillColor("#222222").text(text, x + pad, y + pad, {
    width: width - pad * 2,
    lineGap: 1,
  });
  doc.moveDown(0.8);
}

title("English Speaking AI App Backend");
p("Application Flow Guide for Frontend Developers and End Users");
p(`Generated on: ${new Date().toISOString()}`);

section("1) Goal of This Document");
bullet("Help frontend developers integrate APIs quickly.");
bullet("Help users understand the full learning process from login to AI coaching.");
bullet("Define end-to-end app flow for text and speech interactions.");

section("2) Base API and Response Format");
bullet("Base URL: /api/v1");
bullet("Most protected APIs require Authorization: Bearer <JWT>.");
bullet("Standard success response:");
codeBlock(
  `{
  "success": true,
  "message": "....",
  "data": {}
}`
);
bullet("Standard error response:");
codeBlock(
  `{
  "success": false,
  "message": "....",
  "error": "...."
}`
);

section("3) User Journey (Simple)");
bullet("Step 1: User signs up or logs in.");
bullet("Step 2: User completes onboarding question(s).");
bullet("Step 3: User selects a subscription plan.");
bullet("Step 4: User starts AI conversation via text or voice.");
bullet("Step 5: User reviews past conversation history.");

section("4) Authentication APIs");
endpoint("POST", "/auth/signup", "Create account and receive JWT token.");
endpoint("POST", "/auth/login", "Login with mobile number and receive JWT token.");
endpoint("POST", "/auth/send-otp", "Send OTP to mobile number.");
endpoint("POST", "/auth/verify-otp", "Verify OTP and receive JWT token.");
p("Frontend action: store token securely and send it in Authorization header for protected routes.");

section("5) Profile, Onboarding, and Subscription");
endpoint("GET", "/users/me", "Get logged-in user profile.");
endpoint("PUT", "/users/me", "Update fullName/email/learningPurpose.");
endpoint("GET", "/onboarding/questions", "Get onboarding questions.");
endpoint("POST", "/onboarding/answer", "Save user onboarding answer.");
endpoint("GET", "/onboarding/answers", "Get saved onboarding answers.");
endpoint("GET", "/subscriptions/plans", "Get available plans.");
endpoint("POST", "/subscriptions/select", "Select a plan.");
endpoint("GET", "/subscriptions/current", "Get current selected plan.");

section("6) AI Mentor Service (Core)");
endpoint("POST", "/ai/chat", "Send one sentence and receive grammar correction + explanation + next question.");
p("Request example:");
codeBlock(
  `{
  "message": "I go office yesterday"
}`
);
p("Response data shape:");
codeBlock(
  `{
  "correction": "I went to the office yesterday.",
  "explanation": "Use past tense 'went' for yesterday and add 'the' before office.",
  "nextQuestion": "What did you do after reaching the office?"
}`
);
bullet("Backend also saves each mentor exchange in the conversations table.");

section("7) Speech Processing");
endpoint(
  "POST",
  "/speech/speech-to-text",
  "Accept audio (raw body or audioBase64), convert speech to text using OpenAI Whisper."
);
endpoint(
  "POST",
  "/speech/text-to-speech",
  "Convert text to speech audio and return hosted audio URL."
);
p("Text-to-Speech request example:");
codeBlock(
  `{
  "text": "I went to the office yesterday."
}`
);

section("8) Conversation History Service");
endpoint("POST", "/conversations/start", "Create a new session and get sessionId.");
endpoint("POST", "/conversations/message", "Send message in session and get assistant reply.");
endpoint("GET", "/conversations/:sessionId", "Fetch full message history for that session.");
p("Message request example:");
codeBlock(
  `{
  "sessionId": 1,
  "message": "Hello"
}`
);

section("9) Full Voice + AI Learning Flow");
bullet("User records voice in frontend.");
bullet("Frontend calls /speech/speech-to-text to get text.");
bullet("Frontend sends text to /ai/chat for correction and guidance.");
bullet("Frontend can call /speech/text-to-speech for audio playback of correction.");
bullet("If session mode is active, frontend also uses /conversations/message and stores session timeline.");

section("10) Database Tables Used");
bullet("users");
bullet("subscription_plans");
bullet("user_onboarding_answers");
bullet("conversations");
bullet("conversation_sessions");
bullet("conversation_messages");

section("11) Frontend Integration Notes");
bullet("Always pass JWT for protected APIs.");
bullet("Use standard response keys: success, message, data, error.");
bullet("Display mentor correction/explanation/nextQuestion clearly in UI.");
bullet("Allow user to replay TTS audio from returned audioUrl.");
bullet("Provide history screen using conversation session APIs.");

section("12) Recommended UI Tabs");
bullet("Auth");
bullet("Profile & Onboarding");
bullet("Subscription");
bullet("AI Mentor Chat");
bullet("Voice Practice");
bullet("Conversation History");

doc.end();
console.log(`PDF created: ${outputPath}`);
