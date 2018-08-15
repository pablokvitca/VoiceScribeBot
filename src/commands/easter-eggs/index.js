module.exports = {
    init: (bot) => {
        require('./givesocks.command').init(bot);
        require('./attack.command').init(bot);
        require('./isthisreal.command').init(bot);
        require('./haveigonemad.command').init(bot);
        require('./ivelostthegame.command').init(bot);
    }
}

