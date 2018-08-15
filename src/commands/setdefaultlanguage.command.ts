const languages = [
    "english",
    "spanish"
]

let currentLanguage = languages[0];

export default function setDefaultLanguageCommand(bot) {
    bot.command('setdefaultlanguage', (ctx) => {
        function parseMessage(message, langs) {
            const rawArgs = message.text.replace('/setdefaultlanguage ', '');
            const args = rawArgs.split(" ");
            let newLang;
            langs.forEach((lang, key) => {
                if (args[0] == lang) {
                    newLang = key;
                }
                else {
                    console.log("IS NOT " + lang);
                }
            });
            return newLang;
        }
        const newLang = parseMessage(ctx.message, languages);
        if (newLang !== undefined) {
            currentLanguage = languages[newLang];
            ctx.reply(`Done! Default language set to: ${currentLanguage}`);
        }
        else {
            ctx.reply(`Sorry, could not do that. Language is still: ${currentLanguage}`);
        }
    });
}