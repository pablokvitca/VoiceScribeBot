import { Firestore } from "@google-cloud/firestore";
import { Telegraf } from "telegraf";
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

export default function registerCommands(bot: Telegraf<any>, firestore: Firestore) {

    welcomeMessage(bot, firestore);
    helpMessage(bot);

    transcribeCommand(bot);
    setDefaultLanguageCommand(bot);
    setTagCommand(bot);
    removeTagCommand(bot);
    deleteAudioCommand(bot);
    clearMemoryCommand(bot);
    clearSettingsCommand(bot);

    registerEasterEggs(bot);
}
