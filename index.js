const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config(".env");

const token = process.env.CHANNEL_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.replyOn = function (cmd, context) {
	reg = new RegExp(`^/${cmd}`);
	const bot = this;
	bot.onText(reg, async (msg) => {
		console.log(cmd)
		if (msg.text.split(" ")[0] !== `/${cmd}`) return 0;
		if(context instanceof Function) {
			let isSent = false;
			const send = (text) => {
				if(!isSent) {
					bot.sendMessage(msg.chat.id, text);
				}
			};
			const result = await context(msg, send);
			if(!isSent && result) {
				bot.sendMessage(msg.chat.id, result);
			}
		} else {
			bot.sendMessage(msg.chat.id, context);
		}
	});
};

bot.replyOn("simba", `hello ${1 + 2}`);

// /start
bot.replyOn("start", "Hi, 這是 Justin 拉麵 bot！");

// /help
bot.replyOn(
	"help",
	`
Justin 請我吃拉麵 bot

/start - 開始使用
/poll - 開啟投票
/point - Justin 已經累積的點數
/location - 麵屋雞金位置
/pointrule - 麵屋雞金點數規則
`
);

// /poll
bot.replyOn("poll", (msg, send) => {
	const username = msg.from.username;
	let time = "";
	if (msg.text.split(" ")[1]) {
		time = msg.text.split(" ")[1];
	}
	const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
		if (username === "JustinLin099") {
		if (!time) {
			send("Justin, 你忘了填時間");
		} else if (!time.match(timeRegex)) {
			send("Justin, 這不是時間");
		} else {
			message = `今天 ${time} 要吃拉麵嗎`;
			bot.sendPoll(msg.chat.id, message, ["要", "不要"], {
				is_anonymous: false,
			});
		}
	} else {
		send(`你不是 Justin, 你是 ${username}`);
	}
})

// /point
const getPoint = () => {
	return axios
		.get("https://ramen.justinlin.tw/data.json")
		.then(function (response) {
			return response.data.total;
		})
		.catch(function (error) {
			console.log(error);
		});
};

bot.replyOn("point", async (msg) => `
Justin 目前有 ${await getPoint()} 點
資料由 @gnehs 提供
`)

// /location
bot.replyOn("location", (msg, send) => {
	send("這是麵屋雞金的位置！")
	const latitude = 25.04406477400013;
	const longitude = 121.53271914128021;
	bot.sendLocation(msg.chat.id, latitude, longitude);
} )

// /pointrule
bot.replyOn(
	"pointrule",
	`
1.每消費一碗拉麵可獲得點數一點
2.深夜消費（PM 10:00 起）點數雙倍送！
（麵屋雞金 新生南路店深夜時段將於近期開放、開放時間請注意麵屋雞金 粉專公告）
3.多人消費可以蓋在同一張點卡上、但是不能多張卡合併點數兌換
4.消費當下給予點數、後面不補發
5.累積的點數，可以在五之神製作所重新開幕後，至【五之神製作所】兌換
6.集點卡上兌換品項擇一兌換、以點數最高的品項為準
`
);
