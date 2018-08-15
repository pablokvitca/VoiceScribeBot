import { DocumentSnapshot } from '@google-cloud/firestore';
import { App } from "../app";
import * as fs from 'fs';

const languages = [
    "english",
    "spanish"
]

let currentLanguage = languages[0];

export default function transcribeCommand(app: App) {
    app.bot.command('transcribe', (ctx) => {
        ctx.reply('Transcribing last received audio...');
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
            ctx.reply(`Transcribing using ${currentLanguage} language setting`);
        }
        else {
            ctx.reply(`Sorry, could not do that. Language is default: ${currentLanguage}`);
        }

        app.db.collection('users').doc(App.hashedID(ctx)).get()
            .then((doc: DocumentSnapshot) => {
                if (doc.exists) {
                    const data = doc.data();
                    if (data["last-audio-uploaded"] && data["last-audio-uploaded"].id) {
                        const filePath = process.env.DOWNLOADS_DIR + '/' + data["last-audio-uploaded"].id;
                        if (fs.existsSync(filePath)) {
                            const file = fs.readFileSync(filePath);
                            const audioBytes = file.toString('base64');
                            const audio = {
                                //content: audioBytes,
                                "uri": "gs://bucket-name/path_to_audio_file"
                            };
                            const config = {
                                encoding: 'LINEAR16',
                                sampleRateHertz: 16000,
                                languageCode: 'en-US',
                            };
                            const request = {
                                audio: audio,
                                config: config,
                            };
                            debugger
                            return app.speechClient.recognize(request)

                        } else {
                            //TODO: download from storage
                        }
                    } else {
                        ctx.reply('You need to first foward an audio/voice message to your scribe.');
                    }
                } else {
                    ctx.reply('Sorry, we could not authentificate your user. Please your /start again');
                }
            })
            .then((data) => {
                debugger
                const response = data[0];
                const transcription = response.results
                    .map(result => result.alternatives[0].transcript)
                    .join('\n');
                ctx.reply('Transcription:');
                ctx.reply(transcription);
            })
            .catch(err => {
                ctx.reply('Sorry, we had an error transcribing your audio. Please try again later.');
            });
    });
}