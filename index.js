// Configure DOTENV
require('dotenv').config();
const _ = require('lodash');

const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.TELEGRAM_CHATBOT_TOKEN);

const languages = [
    "english",
    "spanish"
]

let currentLanguage = languages[0];

bot.start((ctx) => ctx.reply('Welcome! TODO: welcome message'));
bot.help((ctx) => ctx.reply('TODO: help message'));

bot.command('setdefaultlanguage', (ctx) => {

    function parseMessage(message, langs) {
        console.log(message.text);
        const rawArgs = message.text.replace('/setdefaultlanguage ', '');
        console.log(rawArgs);
        const args = rawArgs.split(" ");
        console.log(args);
        let newLang;
        langs.forEach((lang, key) => {
            if (args[0] == lang) {
                newLang = key;
            } else {
                console.log("IS NOT " + lang)
            }
        });
        console.log(newLang);
        return newLang;
    }

    const newLang = parseMessage(ctx.message, languages);
    if (newLang !== undefined) {
        currentLanguage = languages[newLang];
        ctx.reply(`Done! Default language set to: ${currentLanguage}`);
    } else {
        ctx.reply(`Sorry, could not do that. Language is still: ${currentLanguage}`);
    }
});
bot.command('transcribe', (ctx) => {
    ctx.reply('Transcribing last received audio...');
    //TODO: 
});
bot.command('settag', (ctx) => {
    ctx.reply('Transcribing last received audio...');
    //TODO: 
});
bot.command('clearmemory', (ctx) => {
    ctx.reply('Clearing audio memory');
    //TODO: 
});
bot.command('clearaudio', (ctx) => {
    ctx.reply('Clearing last audio...');
    //TODO: 
});
bot.command('givesocks', ({ reply }) => reply('Dobby is free.'));

bot.startPolling();