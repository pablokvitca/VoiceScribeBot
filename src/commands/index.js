import Telegraf from 'telegraf';

export function init() {
    const bot = new Telegraf(process.env.TELEGRAM_CHATBOT_TOKEN);

    //TODO: make cleaner
    require('./welcome.message').init(bot);
    require('./help.message').init(bot);
    require('./transcribe.command').init(bot);
    require('./setdefaultlanguage.command').init(bot);
    require('./settag.command').init(bot);
    require('./removetag.command').init(bot);
    require('./deleteaudio.command').init(bot);
    require('./clearmemory.command').init(bot);
    require('./clearsettings.command').init(bot);
    require('./easter-eggs').init(bot);

    bot.startPolling();
}
