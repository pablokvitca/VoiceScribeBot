module.exports = {
    init: (bot) => {
        bot.command('transcribe', (ctx) => {
            ctx.reply('Transcribing last received audio...');
            //TODO: 
        });
    }
}