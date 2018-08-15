const languages = [
    "english",
    "spanish"
]

let currentLanguage = languages[0];

export function init(bot) {
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
                }
                else {
                    console.log("IS NOT " + lang);
                }
            });
            console.log(newLang);
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