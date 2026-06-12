const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("Bot Ativo"));

app.post("/webhook", (req, res) => {
  const data = req.body;
  if (!data.message) return res.send("ok");

  const msg = data.message;
  const chatId = msg.chat.id;

  // 🔒 Só você pode usar
  if (chatId !== 1723287087) return res.send("ok");

  let texto = "";

  if (msg.video) {
    texto = "🎬 VÍDEO\nfile_id: `" + msg.video.file_id + "`";
  } else if (msg.photo) {
    const melhor = msg.photo[msg.photo.length - 1];
    texto = "🖼️ FOTO\nfile_id: `" + melhor.file_id + "`";
  } else {
    return res.send("ok");
  }

  const TOKEN = "8167827099:AAFs0JPtMLC9615GKo8JuPQ2ke-JvgvkIkw";
  fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: texto, parse_mode: "Markdown" })
  });

  res.send("ok");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Rodando na porta " + PORT));
