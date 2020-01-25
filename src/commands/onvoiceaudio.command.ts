import { FileMetadata } from "@google-cloud/storage";
import * as download from 'download';
import { File } from 'telegram-typings';
import { App } from './../app';
import * as fs from 'fs';

function downloadFromMessageServer(ctx: any, file: File) {
    const url = 'https://api.telegram.org/file/bot'
        + ctx.telegram.token
        + '/'
        + file.file_path;
    return download(url, process.env.DOWNLOADS_DIR)
}

function uniqueFileNaming(ctx: any, filePath: String) {
    const fp: string[] = filePath.split('/');
    const filename = fp[fp.length - 1];
    const path: string =
        process.env.DOWNLOADS_DIR + '/' + filename;
    const extension = filename.split(".").pop();
    const output =
        process.env.DOWNLOADS_DIR
        + '/' + App.hashedID(ctx) + '.' + Date.now()
        + '.' + extension;
    fs.renameSync(path, output)
    return output;
}

function getEncodingFromFile(file: any) {
    switch (file.metadata.contentType) {
        case "audio/ogg":
            return "OGG_OPUS";
        case "audio/wave":
            return "LINEAR16";
        case "audio/mp3":
            return "MP3";
        default:
            throw new Error("Invalid audio format");
    }
}

function getSampleRateFromFile(file: any) {
    return 48000;
}

function addFileToFirebase(app: any, ctx: any, uploadReply: any) {
    const file = uploadReply[0];
    const fileMetadata: FileMetadata = file.metadata;
    return app.db.collection('users').doc(App.hashedID(ctx)).update({
        "last-audio-uploaded": {
            metadata: {
                id: fileMetadata.id,
                mediaLink: fileMetadata.mediaLink,
                name: fileMetadata.name,
                timestamp: fileMetadata.updated || fileMetadata.timeCreated,
            },
            id: file.id,
            encoding: getEncodingFromFile(file),
            sample_rate: getSampleRateFromFile(file)
        }
    });
}

export default function onVoiceAudio(app: App) {
    app.bot.on(['voice', 'audio', 'document'], (ctx) => {
        if (ctx.message.voice || ctx.message.document || ctx.message.audio) {
            const voice = ctx.message.voice || ctx.message.document || ctx.message.audio;
            let filePath;
            ctx.telegram.getFile(voice.file_id)
                .then((file: File) => {
                    filePath = file.file_path;
                    return downloadFromMessageServer(ctx, file);
                })
                .then(() => {
                    return uniqueFileNaming(ctx, filePath);
                })
                .then((convertedOutputPath) => {
                    return app.bucket.upload(convertedOutputPath)
                })
                .then((uploadReply) => {
                    return addFileToFirebase(app, ctx, uploadReply)
                })
                .catch((error: any) => {
                    console.error(error);
                });
        }
    });
}