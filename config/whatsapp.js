const axios = require("axios");

const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

async function sendWhatsAppMessage(to, text, mediaUrl = null) {
  const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: mediaUrl ? "image" : "text",
    ...(mediaUrl ? { image: { link: mediaUrl, caption: text } } : { text: { body: text } }),
  };

  try {
    await axios.post(url, payload, {
      headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ WhatsApp send error:", err.response?.data || err.message);
  }
}

module.exports = { sendWhatsAppMessage };
