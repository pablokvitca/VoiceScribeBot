import { Firestore, QueryDocumentSnapshot, QuerySnapshot } from '@google-cloud/firestore';
import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import Telegraf from 'telegraf';
import registerCommands from './commands';
import { Bucket } from '@google-cloud/storage';

const session = require('telegraf/session')
const serviceAccount = require('../.voice-scribe-bot-firebase-key.json');
const Stage = require('telegraf/stage');

export class App {

    status = {
        env: undefined,
        firebase: false,
        telegraf: false
    }

    bot: Telegraf<any>;
    db: Firestore;
    stage: any;
    storage: admin.storage.Storage;
    bucket: Bucket;
    speechClient: any;

    constructor() {
        this.configureEnvironment();
        this.configureFirebase();
        this.configureSpeechClient();
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
            databaseURL: process.env.FIREBASE_DATABASE_URL,
            storageBucket: 'gs://voice-scribe-bot.appspot.com'
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

        this.storage = admin.storage();
        this.bucket = this.storage.bucket();
    }

    private configureSpeechClient() {
        const speech = require('@google-cloud/speech');
        this.speechClient = new speech.SpeechClient();
    }

    private configureTelegraf() {
        this.status.telegraf = true;
        this.bot = new Telegraf(process.env.TELEGRAM_CHATBOT_TOKEN);
        this.bot.use(session());
        this.stage = new Stage([], { default: 'super-wizard' });
        this.bot.use(this.stage.middleware());
        registerCommands(this);
    }

    startPolling() {
        if (this.status.telegraf && this.bot) {
            this.bot.startPolling();
        }
    }

    public static hashedID(ctx) {
        const crypto = require("crypto");
        return crypto.createHash('md5').update('U' + ctx.message.from.id).digest("hex");
    }
}

export default new App();