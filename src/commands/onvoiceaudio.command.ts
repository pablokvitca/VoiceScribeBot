import { FileMetadata } from "@google-cloud/storage";
import * as download from 'download';
import { File } from 'telegram-typings';
import { App } from './../app';

const linear16 = require('linear16');

export default function onVoiceAudio(app: App) {
    app.bot.on(['voice', 'audio', 'document'], (ctx) => {
        if (ctx.message.voice || ctx.message.document || ctx.message.audio) {
            const voice = ctx.message.voice || ctx.message.document || ctx.message.audio;
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
                    const path: string =
                        process.env.DOWNLOADS_DIR
                        + '/'
                        + fp[fp.length - 1];
                    const output =
                        process.env.DOWNLOADS_DIR
                        + '/'
                        + App.hashedID(ctx) + '-' + Date.now()
                        + '.wav';
                    return linear16(path, output);
                })
                .then((convertedOutputPath) => {
                    return app.bucket.upload(convertedOutputPath)
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
}