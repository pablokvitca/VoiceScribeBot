module.exports = {
    init: (bot) => {
        require('./transcribe.command').init(bot);
        require('./setdefaultlanguage.command').init(bot);
        require('./settag.command').init(bot);
        require('./removetag.command').init(bot);
        require('./deleteaudio.command').init(bot);
        require('./clearmemory.command').init(bot);
        require('./clearsettings.command').init(bot);
        require('./easter-eggs').init(bot);
    }
}
