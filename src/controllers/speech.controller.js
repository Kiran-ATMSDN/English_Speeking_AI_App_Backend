const { transcribeAudio, textToSpeech } = require("../services/speech.service");

async function speechToText(req, res) {
  try {
    const text = await transcribeAudio(req);
    return res.success("Speech transcribed successfully.", { text });
  } catch (error) {
    return res.error("Failed to transcribe speech.", 500, error.message);
  }
}

async function convertTextToSpeech(req, res) {
  try {
    const text = String(req.body.text || "").trim();
    if (!text) {
      return res.error("text is required.", 400);
    }

    const fileName = await textToSpeech(text);
    const audioUrl = `${req.protocol}://${req.get("host")}/public/audio/${fileName}`;

    return res.success("Text converted to speech successfully.", { audioUrl });
  } catch (error) {
    return res.error("Failed to convert text to speech.", 500, error.message);
  }
}

module.exports = {
  speechToText,
  convertTextToSpeech,
};
