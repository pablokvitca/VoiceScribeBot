import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import Telegraf from 'telegraf';
import registerCommands from './commands';

class App {

    status = {
        env: undefined,
        firebase: false,
        telegraf: false
    }

    bot: Telegraf<any>;
    db: admin.database.Database;

    constructor() {
        this.configureEnvironment();
        this.configureFirebase();
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
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_CONNECTION_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CONNECTION_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_CONNECTION_PRIVATE_KEY
            }), //IF RUNNING ON GCP USE: admin.credential.applicationDefault()
            databaseURL: process.env.FIREBASE_DATABASE_URL
        });

        // As an admin, the app has access to read and write all data, regardless of Security Rules
        this.db = admin.database();
        const languages = this.db.ref('languages');
        console.log(languages);
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