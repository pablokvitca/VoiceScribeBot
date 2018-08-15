module.exports = {
    init: (bot) => {
        bot.command('attack', ({ reply }) =>
            reply('You want weapons? We are in a library! BOOKS! The best weapons in the world!')
        );
    }
}