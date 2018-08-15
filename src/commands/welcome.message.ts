import { Firestore, WriteResult, DocumentSnapshot } from '@google-cloud/firestore';
import Telegraf, { Composer } from "telegraf";
import { App } from '../app';

const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');

export default function welcomeMessage(bot: Telegraf<any>, firestore: Firestore) {

    const nameStepHandler: any = new Composer();
    nameStepHandler.hears(/.*/gm, (ctx) => {
        firestore.collection('users').doc(App.hashedID(ctx)).update({
            name: ctx.message.text
        })
            .then((result: WriteResult) => {
                ctx.reply(`Nice to meet you ${ctx.message.text}.`);
                ctx.reply('Do you have a beta testing code? Use /skip to skip');
            })
            .catch((error: any) => {
                console.log(error);
            });
        return ctx.wizard.next();
    });
    nameStepHandler.command('next', (ctx) => {
        ctx.wizard.next();
    });
    nameStepHandler.use((ctx) => ctx.replyWithMarkdown('Press `Next` button or type /next'));

    const betaCodeHandler: any = new Composer();
    betaCodeHandler.command('skip', (ctx) => {
        ctx.reply(`Skipping beta program configuration.`);
        return ctx.wizard.next();
    });
    betaCodeHandler.hears(/.*/gm, (ctx) => {
        const code = ctx.message.text;
        ctx.reply(`Authorizing beta code ${code}...`);
        firestore.collection('betatesters').doc(code).get()
            .then((doc: DocumentSnapshot) => {
                if (doc.exists) {
                    if (doc.data().claimed) {
                        ctx.reply(`Sorry code ${code} is already claimed.`);
                    } else {
                        doc.ref.update({
                            claimed: firestore.collection('users').doc(App.hashedID(ctx))
                        });
                        firestore.collection('users').doc(App.hashedID(ctx)).update({
                            'beta-tester-code': ctx.message.text,
                            betatester: true
                        }).then((result: WriteResult) => {
                            ctx.reply(`Succesfully claimed code ${code}.`);
                        }).catch((error: any) => {
                            console.log(error);
                        });
                    }
                } else {
                    ctx.reply(`Sorry code ${code} does not exist.`);
                }
            })
            .catch((error: any) => {
                console.log(error);
            });

        return ctx.wizard.next();
    });
    betaCodeHandler.command('next', (ctx) => {
        ctx.wizard.next();
    });
    betaCodeHandler.use((ctx) => ctx.replyWithMarkdown('Press `Next` button or type /next'));

    const superWizard = new WizardScene('super-wizard',
        (ctx) => {
            const id = App.hashedID(ctx);
            const data = {
                betatester: false,
                defaultlanguage: firestore.collection('languages').doc('en-us'),
            }
            const doc = firestore.doc('users/' + id);
            doc.create(data)
                .then((result: WriteResult) => {
                    console.log('Written in ' + result.writeTime);
                })
                .catch((error: any) => {
                    console.log(error);
                });
            ctx.reply('Welcome! I am VoiceScribe. I\'ll help you read your voice notes!');
            ctx.reply('Let\'s setup your own personal scribe...');
            ctx.reply('Use /next to continue');
            return ctx.wizard.next();
        },
        (ctx) => {
            ctx.reply('What\'s your name?');
            return ctx.wizard.next();
        },
        nameStepHandler,
        betaCodeHandler,
        (ctx) => {
            ctx.reply('That\'s it! Use /help if you have any questions.');
            return ctx.scene.leave();
        }
    );

    bot.start((ctx: any) => {
        firestore.collection('users').doc(App.hashedID(ctx)).get()
            .then((doc: DocumentSnapshot) => {
                if (!doc.exists)
                    ctx.wizard.start();
            })
            .catch((error: any) => {
                console.log(error);
            });
    });
}