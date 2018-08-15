/***************
*** FIREBASE ***
***************/
import * as admin from 'firebase-admin';

// Fetch the service account key JSON file contents
import serviceAccount from ".voice-scribe-bot-firebase-store.json";

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://voice-scribe-bot.firebaseio.com"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var ref = db.ref("restricted_access/secret_document");
ref.once("value", function (snapshot) {
    console.log(snapshot.val());
});

/***************
*** Telegraf ***
***************/
require('./welcome.message').init(bot);