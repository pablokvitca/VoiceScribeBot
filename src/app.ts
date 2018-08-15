import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import Telegraf from 'telegraf';
import serviceAccount from '../.voice-scribe-bot-firebase-store.json';
import registerCommands from './commands';

class App {

    status = {
        env: undefined,
        firebase: false,
        telegraf: false
    }

    bot: any;

    constructor() {
        this.configureEnvironment();
        //this.configureFirebase();
        this.configureTelegraf();
    }

    private configureEnvironment() {
        dotenv.config();
        this.status.env = process.env.environment; //TODO: TEST
    }

    private configureFirebase() {
        this.status.firebase = true;
        // Initialize the app with a service account, granting admin privileges
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://voice-scribe-bot.firebaseio.com"
        });

        // As an admin, the app has access to read and write all data, regardless of Security Rules
        var db = admin.database();
        var ref = db.ref("restricted_access/secret_document");
        //TODO: DUMMY SCAFFOLD
        ref.once("value", function (snapshot) {
            console.log(snapshot.val());
        });
    }

    private configureTelegraf() {
        this.status.telegraf = true;
        this.bot = new Telegraf(process.env.TELEGRAM_CHATBOT_TOKEN);
        registerCommands(this.bot);
    }

    startPolling() {
        if (this.status.telegraf && this.bot) {
            this.bot.startPolling();
        }
    }
}

export default new App();