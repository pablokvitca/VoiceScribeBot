import { Firestore, QueryDocumentSnapshot, QuerySnapshot } from '@google-cloud/firestore';
import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import Telegraf from 'telegraf';
import registerCommands from './commands';

var serviceAccount = require('../.voice-scribe-bot-firebase-store.json');

class App {

    status = {
        env: undefined,
        firebase: false,
        telegraf: false
    }

    bot: Telegraf<any>;
    db: Firestore;

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
            credential: admin.credential.cert(serviceAccount), //IF RUNNING ON GCP USE: admin.credential.applicationDefault()
            databaseURL: process.env.FIREBASE_DATABASE_URL
        });

        // As an admin, the app has access to read and write all data, regardless of Security Rules
        this.db = admin.firestore();
        this.db.collection('languages').get()
            .then((languages: QuerySnapshot) => {
                languages.forEach((doc: QueryDocumentSnapshot) => {
                    console.log(doc.id, '=>', doc.data());
                });
            }).catch((err) => {
                console.log('Error getting documents', err);
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