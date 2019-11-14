import { App } from './../app';
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
import onVoiceAudio from "./onvoiceaudio.command";

export default function registerCommands(app: App) {

    onVoiceAudio(app);

    welcomeMessage(app.bot, app.db);
    helpMessage(app.bot);

    transcribeCommand(app);
    setDefaultLanguageCommand(app.bot);
    setTagCommand(app.bot);
    removeTagCommand(app.bot);
    deleteAudioCommand(app.bot);
    clearMemoryCommand(app.bot);
    clearSettingsCommand(app.bot);

    registerEasterEggs(app.bot);
}
