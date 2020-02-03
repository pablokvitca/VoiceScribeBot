# VoiceScribe

# Introduction

This project is an open-source chatbot for the [Telegram](https://telegram.org/) chat app. The main goal of the project is to transcribe a voice/audio message to a readable text, and send it back to the user. Accuracy on the transcribed text depends on the audio quality (and the Google Text-To-Speech service) so they are far from perfect, do not rely on this completely.

## Inspiration
This chatbot was inspired by friends and family sending several minutes long voice messages. The chatbot allows me to get a quick idea of the voice message without listening to it (transcriptions are not perfect, so eventually you should listen to the actual message), helping me decide if it needs my inmediate attention. It also provides a discreet way to get the information on audio, which can be useful in public situations (and even for people with hearing difficulties!).

# Getting Started

**NOTE**: Unfortunately, a current limitation of the server will only work for transcribing audio files recorded on the Telegram apps (or others using the same exact format and sample rates), because of format conversion and audio sample rate issues. We are working to support more audio formats, eventually allowing for fowarded audios from other chat apps to be transcribed as well!

## Technologies Used
- [Node.JS](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Telegraf](https://github.com/telegraf/telegraf)
- [Google Firebase](https://firebase.google.com/)
- [Google Speech-To-Text](https://cloud.google.com/text-to-speech)

## Try it yourself
### What you'll need
- A Telegram account
- A Node.JS installation (only tested on version 13.7.0)
- A Telegram chatbot token (see [here](https://telegraf.js.org/#/?id=telegram-token) for how to get a key)
- A [Firebase](https://firebase.google.com/) Project with FireStore and file storage
- A [Google Speech-To-Text API Key](https://cloud.google.com/text-to-speech)

### How to run the project
1. Clone the project and install the dependencies:
```
git clone https://github.com/fall19systems/monorepo-pablokvitca.git
```
```
npm install
```
2. Create a *.env* file with the following template, and place it on the project root:

```
TELEGRAM_CHATBOT_TOKEN="[TOKEN HERE]"
DOWNLOADS_DIR='dist/downloads/voice' # Could be changed to your prefered path
FIREBASE_DATABASE_URL="[FIRESTORE URL HERE]"
FIREBASE_CONFIG='firebase.json'
FIREBASE_APPLICATION_CREDENTIALS="[PATH TO [project-name]-firebase-key.json]" # Example: ".voice-scribe-chatbot-project-firebase-key.json"
GOOGLE_APPLICATION_CREDENTIALS="[PATH TO [project-name]-bot-speech-2-text-service-key.json]]" # Example: ".voice-scribe-chatbot-project-speech-2-text-service-key.json"
```
3. Start up the server
```
npm start
```
4. Test sending */start* to your bot from Telegram
5. If everything was setup correctly, the server should reply with a welcome message.
6. Done!

## Production Release

A published production release might come in the future, but as a personal project built on my free time, it could take a while.
Publishing the project would also require lots of non-technical work like figuring out pricing (Firebase and Google Speech-To-Text can be expensive) disclaimers, privacy policies, and other legal stuff

## Easter Eggs
For fun, I added a few cute easter egg commands on the bot. Try them out:
- */attack*
- */givesocks*
- */haveigonemad*
- */isthisreal*

# Coming Soon / Future Work
- Implementing the */help* message (currently a placeholder)
- Implementing the */clearmemory* command (currently a placeholder)
- Implementing the */deleteaudio* command (currently a placeholder)
- Implementing the */clearsettings* command (currently a placeholder)
- Adding support for more audio file formats and sample rates
- Implementing the */settag* and */removetag* commands (currently placeholders)
- Implement usage of other Speech-To-Text APIs, letting the user select which one to use for transcription

# Authors
- Pablo Kvitca