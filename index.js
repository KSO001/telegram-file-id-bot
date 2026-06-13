const express = require("express");
const app = express();
const https = require("https");
app.use(express.json());

app.get("/", (req, res) => res.send("Bot Ativo"));

app.post("/webhook", (req, res) => {
  const data = req.body;
  console.log("Recebido:", JSON.stringify(data));

  if (!data.message) return res.send("ok");

  const msg = data.message;
  const chatId = msg.chat.id;
  console.log("Chat ID:", chatId);

  if (chatId !== 1723287087) return res.send("ok");

  let texto = "";

  if (msg.video) {
    texto = "🎬 VÍDEO\nfile_id: <code>" + msg.video.file_id + "</code>";
  } else if (msg.photo) {
    const melhor = msg.photo[msg.photo.length - 1];
    texto = "🖼️ FOTO\nfile_id: <code>" + melhor.file_id + "</code>";
  }

  const TOKEN = "8167827099:AAHpzcaahW1gUV7Wy0bc0IIcFO45SKAhrP0";
  const body = JSON.stringify({ chat_id: chatId, text: texto, parse_mode: "HTML" });
  
  const options = {
    hostname: "api.telegram.org",
    path: `/bot${TOKEN}/sendMessage`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body)
    }
  };

  const req2 = https.request(options, (r) => {
    let data = "";
    r.on("data", (chunk) => data += chunk);
    r.on("end", () => console.log("Resposta Telegram:", data));
  });

  req2.on("error", (e) => console.log("Erro:", e.toString()));
  req2.write(body);
  req2.end();

  res.send("ok");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Rodando na porta " + PORT));
