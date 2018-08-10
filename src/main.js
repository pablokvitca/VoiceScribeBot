const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.TELEGRAM_CHATBOT_TOKEN);

require('./welcome.message').init(bot);
require('./help.message').init(bot);

require('./commands').init(bot);

bot.startPolling();