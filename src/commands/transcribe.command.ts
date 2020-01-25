import { DocumentSnapshot } from '@google-cloud/firestore';
import { App } from "../app";

const languages = [
    "english",
    "spanish"
]

let currentLanguage = languages[0];

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

function dataContainsAudio(data: any) {
    return data["last-audio-uploaded"]
        && data["last-audio-uploaded"].id;
    //&& data["last-audio-uploaded"].encoding
    //&& data["last-audio-uploaded"].sample_rate;
}

function mapLanguageToCode(language: string) {
    const mapDict = {
        "english": "en-US",
        //"spanish": "es-ES",
    }
    return mapDict[language];
}

function transcribeAudio(app: App, ctx: any, doc: DocumentSnapshot) {
    if (doc.exists) {
        const data = doc.data();
        if (dataContainsAudio(data)) {
            const audio = data["last-audio-uploaded"]
            const encoding = audio.encoding
            const sample_rate = audio.sample_rate
            const request = {
                audio: {
                    uri: `gs://${app.bucket.id}/${audio.id}`
                },
                config: {
                    encoding: encoding,
                    sampleRateHertz: sample_rate,
                    languageCode: mapLanguageToCode(currentLanguage)
                }
            };
            return app.speechClient.recognize(request);
        } else {
            ctx.reply('You need to first foward an audio/voice message to your scribe.');
        }
    } else {
        ctx.reply('Sorry, we could not authorize your user. Please use /start again');
    }
}

function sendTranscription(ctx: any, data: any) {
    const response = data[0];
    if (response.results.length > 0) {
        const alternatives = response.results[0].alternatives;
        let highest = alternatives[0];
        let infoReply = "";
        if (alternatives > 1) {
            alternatives.forEach((alternative) => {
                if (alternative.confidence > highest.confidence)
                    highest = alternative;
            });
            infoReply = `. There are ${alternatives.length - 1} other alternatives`;
        }
        const confidence = highest.confidence.toPrecision(4) * 100;
        //TODO: fix confidence precision rendering
        infoReply = `Transcribed text with confidence of ${confidence}%` + infoReply
        ctx.reply(infoReply);
        ctx.reply(highest.transcript);
        //TODO: save transcriptions to firebase
    } else {
        ctx.reply('We could not transcribe anything from that. Sorry. Currently we only support audio files recorded directly on the Telegram app.');
    }
}

function sendError(ctx: any, err: any) {
    console.log(err);
    ctx.reply('Sorry, we had an error transcribing your audio. Please try again later.');
}

export default function transcribeCommand(app: App) {
    app.bot.command('transcribe', (ctx) => {
        ctx.reply('Transcribing last received audio...');
        const newLang = parseMessage(ctx.message, languages);
        if (newLang !== undefined) {
            currentLanguage = languages[newLang];
        }
        ctx.reply(`Transcribing using ${currentLanguage} language setting`);
        app.db.collection('users').doc(App.hashedID(ctx)).get()
            .then((doc: DocumentSnapshot) => transcribeAudio(app, ctx, doc))
            .then((data) => sendTranscription(ctx, data))
            .catch((err) => sendError(ctx, err));
    });
}