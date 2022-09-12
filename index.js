const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config('.env');

const token = process.env.CHANNEL_TOKEN;
const bot = new TelegramBot(token, {polling: true});

// /start
bot.onText(/\/start/, function(msg) {
  const chatId = msg.chat.id;
  const replyMessage = 'Hi, 這是 Justin 拉麵 bot！';
  bot.sendMessage(chatId, replyMessage);
});

// /help
bot.onText(/\/help/, function(msg) {
  const chatId = msg.chat.id;
  let replyMessage = 'Justin 請我吃拉麵 bot\n';
  replyMessage += '\n';
  replyMessage += '/start\n';
  replyMessage += '/poll 開啟投票\n';
  replyMessage += '/point Justin 已經累積的點數\n';
  bot.sendMessage(chatId, replyMessage);
});

// /poll
bot.onText(/\/poll/, function(msg, match) {
  const chatId = msg.chat.id;
  const username = msg.from.username;
  let time = '';
  if (msg.text.split(' ')[1]) {
    time = msg.text.split(' ')[1];
  }
  const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  if (username == 'JustinLin099' || 'liaojason2') {
    if (!time) bot.sendMessage(chatId, 'Justin, 你忘了填時間');
    else if (!time.match(timeRegex)) bot.sendMessage(chatId, 'Justin, 這不是時間');
    else {
      message = '今天 ' + time + ' 要吃拉麵嗎';
      bot.sendPoll(chatId, message, ['要', '不要'], {
        is_anonymous: false,
      });
    }
  } else {
    const replyMessage = '你不是 Justin, 你是 ' + username;
    bot.sendMessage(chatId, replyMessage);
  }
});

const getPoint = () => {
  const data = axios
      .get('https://ramen.justinlin.tw/data.json')
      .then(function(response) {
        return response.data.total;
      })
      .catch(function(error) {
        console.log(error);
      });
  return data;
};

// /point
bot.onText(/\/point/, async function(msg) {
  const chatId = msg.chat.id;
  const point = await getPoint();
  replyMessage = 'Justin 目前有 ' + point + ' 點';
  bot.sendMessage(chatId, replyMessage);
});
