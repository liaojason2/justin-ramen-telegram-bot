const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const date = require('date-and-time');
const fs = require('fs');
require('dotenv').config('.env');

const token = process.env.CHANNEL_TOKEN;
const bot = new TelegramBot(token, {polling: true});


// /start
bot.onText(/^\/start(@.*|$)/, function(msg) {
  const chatId = msg.chat.id;
  const replyMessage = 'Hi, 這是 Justin 拉麵 bot！';
  bot.sendMessage(chatId, replyMessage);
});

// /help
bot.onText(/^\/help(@.*|$)/, function(msg) {
  const chatId = msg.chat.id;
  let replyMessage = 'Justin 請我吃拉麵 bot\n';
  replyMessage += '\n';
  replyMessage += '/start\n';
  replyMessage += '/intro Justin 的集點計畫';
  replyMessage += '/poll 開啟投票\n';
  replyMessage += '/point Justin 已經累積的點數\n';
  replyMessage += '/location 麵屋雞金位置\n';
  replyMessage += '/pointrule 麵屋雞金點數規則\n';
  replyMessage += '/dev 開發者資訊';
  bot.sendMessage(chatId, replyMessage);
});

// /intro
bot.onText(/^\/intro(@.*|$)/, (message) => {
  const chatId = message.chat.id;
  fs.readFile('./data.json', (err, data) => {
    const replyMessage = JSON.parse(data).data.intro;
    bot.sendMessage(chatId, replyMessage);
  });
});

const processPinedMessage = (message) => {
  fs.readFile('./data/db.json', (error, content) => {
    if (!content) return;
    const data = JSON.parse(content);
    const chatId = data.chatId;
    bot.unpinChatMessage(chatId);
  });
  bot.pinChatMessage(message.chat.id, message.message_id);
  const pinnedMessageInfo = {
    chatId: message.chat.id,
    message_id: message.message_id,
  };
  fs.writeFileSync('./data/db.json', JSON.stringify(pinnedMessageInfo));
};

// /poll
bot.onText(/^\/poll(?:@.*?)?( .*|$)/, function(msg, match) {
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
      const sentPollMessage = bot.sendPoll(chatId, message, ['要', '不要'], {
        is_anonymous: false,
      });
      sentPollMessage.then((message)=>{
        processPinedMessage(message);
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

const getTodayRequiredPoint = (today, startDay) => {
  return Math.ceil(date.subtract(today, startDay).toDays()) * 14;
};

// /point
bot.onText(/^\/point(@.*|$)/, async (message) => {
  const chatId = message.chat.id;
  const startDay = new Date('2022/9/12');
  const today = new Date();
  const point = await getPoint();
  const todayRequiredPoint = getTodayRequiredPoint(today, startDay);
  replyMessage = `Justin 目前有 ${point} 點, 完成度 ${Math.floor(point/300*100)}%\n`;
  replyMessage += `Justin 到今天應該要有 ${todayRequiredPoint} 點\n`;
  if (todayRequiredPoint - point > 0) replyMessage += 'Justin 進度落後了！\n';
  else replyMessage += 'Justin 目前有達到目標進度！\n';
  replyMessage += '資料由 @gnehs 提供';
  bot.sendMessage(chatId, replyMessage);
});

// /location
bot.onText(/^\/location(@.*|$)/, (msg) => {
  const chatId = msg.chat.id;
  const latitude = 25.04406477400013;
  const longitude = 121.53271914128021;
  bot.sendMessage(chatId, '這是麵屋雞金的位置！');
  bot.sendLocation(chatId, latitude, longitude);
});

// /pointrule
bot.onText(/^\/pointrule(@.*|$)/, (msg) => {
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
bot.onText(/^\/dev(@.*|$)/, function(msg) {
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
