var TelegramBot = require("node-telegram-bot-api");
require("dotenv").config(".env"); 
var token = process.env.CHANNEL_TOKEN;

var bot = new TelegramBot(token, { polling: true });

// /start
bot.onText(/\/start/, function (msg) {
  var chatId = msg.chat.id; 
  var resp = "Hi, 這是 Justin 拉麵 bot！"; 
  bot.sendMessage(chatId, resp);
});

// /help
bot.onText(/\/hi/, function (msg) {
  var chatId = msg.chat.id;
  var resp = "Hi";
  bot.sendMessage(chatId, resp);
});

// /help
bot.onText(/\/help/, function (msg) {
  var chatId = msg.chat.id;
  var resp = "Justin 請我吃拉麵 bot\n\n ";
  var startFunction = "/start"  
  var pollFunction = "/poll 開啟投票"
  var resp = "賈斯丁拉麵 bot\n\n" + startFunction + "\n" + pollFunction;
  bot.sendMessage(chatId, resp);
});

// /poll
bot.onText(/\/poll/, function (msg) {
  var chatId = msg.chat.id;
  bot.sendPoll(chatId, "今天要吃拉麵嗎", ["要", "不要"], {
    is_anonymous: false,
  });
});
