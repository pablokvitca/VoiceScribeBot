import { App } from './../app';
import { Firestore } from "@google-cloud/firestore";
import { Telegraf } from "telegraf";
import { File } from "telegram-typings";
import clearMemoryCommand from "./clearmemory.command";
import clearSettingsCommand from "./clearsettings.command";
import deleteAudioCommand from "./deleteaudio.command";
import registerEasterEggs from "./easter-eggs";
import helpMessage from "./help.message";
import removeTagCommand from "./removetag.command";
import setDefaultLanguageCommand from "./setdefaultlanguage.command";
import setTagCommand from "./settag.command";
import transcribeCommand from "./transcribe.command";
import welcomeMessage from "./welcome.message";
import * as download from 'download';
import fs from 'fs';
import { Bucket, FileMetadata } from "@google-cloud/storage";

export default function registerCommands(app: App) {

    app.bot.on(['voice', 'audio'], (ctx) => {
        if (ctx.message.voice) {
            const voice = ctx.message.voice;
            let filePath;
            ctx.telegram.getFile(voice.file_id)
                .then((file: File) => {
                    filePath = file.file_path;
                    const url = 'https://api.telegram.org/file/bot'
                        + ctx.telegram.token
                        + '/'
                        + file.file_path;
                    return download(url, process.env.DOWNLOADS_DIR)
                })
                .then(() => {
                    const fp: string[] = filePath.split('/');
                    const path: string = process.env.DOWNLOADS_DIR
                        + '/'
                        + fp[fp.length - 1];
                    return app.bucket.upload(path)
                })
                .then((reply) => {
                    const file = reply[0];
                    const fileMetadata: FileMetadata = file.metadata;
                    return app.db.collection('users').doc(App.hashedID(ctx)).update({
                        "last-audio-uploaded": {
                            metadata: {
                                id: fileMetadata.id,
                                mediaLink: fileMetadata.mediaLink,
                                name: fileMetadata.name,
                                timestamp: fileMetadata.updated || fileMetadata.timeCreated
                            },
                            id: file.id
                        }
                    });
                })
                .catch((error: any) => {
                    console.error(error);
                });
        }
    });

    welcomeMessage(app.bot, app.db);
    helpMessage(app.bot);

    transcribeCommand(app.bot);
    setDefaultLanguageCommand(app.bot);
    setTagCommand(app.bot);
    removeTagCommand(app.bot);
    deleteAudioCommand(app.bot);
    clearMemoryCommand(app.bot);
    clearSettingsCommand(app.bot);

    registerEasterEggs(app.bot);
}
