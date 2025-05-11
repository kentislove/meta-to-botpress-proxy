const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const VERIFY_TOKEN = 'BOT';
const BOTPRESS_WEBHOOK = 'https://webhook.botpress.cloud/1bf67dd0-7894-4985-b43a-ad674d91ec35'; // 請替換為您的 Botpress Webhook URL

// 處理 Meta 的驗證請求
app.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// 接收來自 Meta 的訊息並轉發至 Botpress
app.post('/', async (req, res) => {
  try {
    await axios.post(BOTPRESS_WEBHOOK, req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error('轉發失敗', err.message);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => console.log(`Webhook Proxy 運行於 ${PORT}`));
