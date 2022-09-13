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
  replyMessage += '/location 麵屋雞金位置\n';
  replyMessage += '/pointrule 麵屋雞金點數規則\n';
  replyMessage += '/dev 開發者資訊';
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
  if (username === 'JustinLin099') {
    if (!time) bot.sendMessage(chatId, 'Justin, 你忘了填時間');
    else if (!time.match(timeRegex)) {
      bot.sendMessage(chatId, 'Justin, 這不是時間');
    } else {
      message = `今天 ${time} 要吃拉麵嗎`;
      bot.sendPoll(chatId, message, ['要', '不要'], {
        is_anonymous: false,
      });
    }
  } else {
    const replyMessage = `你不是 Justin, 你是 ${username}`;
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
bot.onText(/\/point(@.*|$)/, async (message) => {
  const chatId = message.chat.id;
  const point = await getPoint();
  replyMessage = `Justin 目前有 ${point} 點\n`;
  replyMessage += '資料由 @gnehs 提供';
  bot.sendMessage(chatId, replyMessage);
});

// /location
bot.onText(/\/location/, (msg) => {
  const chatId = msg.chat.id;
  const latitude = 25.04406477400013;
  const longitude = 121.53271914128021;
  bot.sendMessage(chatId, '這是麵屋雞金的位置！');
  bot.sendLocation(chatId, latitude, longitude);
});

// /pointrule
bot.onText(/\/pointrule/, (msg) => {
  const chatId = msg.chat.id;
  let replyMessage = '1.每消費一碗拉麵可獲得點數一點\n';
  replyMessage += '2.深夜消費(PM10:00起)點數雙倍送!\n';
  replyMessage += '(麵屋雞金 新生南路店深夜時段將於近期開放、開放時間請注意麵屋雞金 粉專公告)\n';
  replyMessage += '3.多人消費可以蓋在同一張點卡上、但是不能多張卡合併點數兌換。\n';
  replyMessage += '4.消費當下給予點數、後面不補發。\n';
  replyMessage += '5.累積的點數、可以在五之神製作所重新開幕後、至【五之神製作所】兌換\n';
  replyMessage += '6.集點卡上兌換品項擇一兌換、以點數最高的品項為準\n';
  bot.sendMessage(chatId, replyMessage);
});

// /dev
bot.onText(/\/dev/, function(msg) {
  const chatId = msg.chat.id;
  let replyMessage = '開發者資訊\n';
  replyMessage += '\n';
  replyMessage += 'Web develop by @gnehs\n';
  replyMessage += 'https://ramen.justinlin.tw/\n';
  replyMessage += '\n';
  replyMessage += 'Bot develop by @liaojason2\n';
  replyMessage += 'https://github.com/liaojason2/justin-ramen-telegram-bot';
  bot.sendMessage(chatId, replyMessage);
});
