import { DocumentSnapshot } from '@google-cloud/firestore';
import { App } from "../app";

const languages = [
    "english",
    "spanish"
]

let currentLanguage = languages[0];

export default function transcribeCommand(app: App) {
    app.bot.command('transcribe', (ctx) => {
        ctx.reply('Transcribing last received audio...');
        function parseMessage(message, langs) {
            const rawArgs = message.text.replace('/transcribe ', '');
            const args = rawArgs.split(" ");
            let newLang;
            langs.forEach((lang, key) => {
                if (args[0] == lang) {
                    newLang = key;
                }
            });
            return newLang;
        }
        const newLang = parseMessage(ctx.message, languages);
        if (newLang !== undefined) {
            currentLanguage = languages[newLang];
            ctx.reply(`Transcribing using ${currentLanguage} language setting`);
        }
        app.db.collection('users').doc(App.hashedID(ctx)).get()
            .then((doc: DocumentSnapshot) => {
                if (doc.exists) {
                    const data = doc.data();
                    if (data["last-audio-uploaded"] && data["last-audio-uploaded"].id) {
                        const request = {
                            audio: {
                                "uri": "gs://voice-scribe-bot.appspot.com/" + data["last-audio-uploaded"].id
                            },
                            config: {
                                encoding: "OGG_OPUS",
                                sampleRateHertz: 48000,
                                languageCode: 'en-US'
                            }
                        };
                        return app.speechClient.recognize(request);
                    } else {
                        ctx.reply('You need to first foward an audio/voice message to your scribe.');
                    }
                } else {
                    ctx.reply('Sorry, we could not authentificate your user. Please use /start again');
                }
            })
            .then((data) => {
                const response = data[0];
                if (response.results.length > 0) {
                    const alternatives = response.results[0].alternatives;
                    let highest = alternatives[0];
                    alternatives.forEach((alternative) => {
                        if (alternative.confidence > highest.confidence) {
                            highest = alternative;
                        }
                    });
                    ctx.reply(`Transcription (confidence ${highest.confidence}; alternatives: ${alternatives.length}):`);
                    ctx.reply(highest.transcript);
                } else {
                    ctx.reply('We could not transcribe anything from that. Sorry.');
                }
            })
            .catch((err) => {
                console.log(err);
                ctx.reply('Sorry, we had an error transcribing your audio. Please try again later.');
            });
    });
}