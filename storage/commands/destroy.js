const Discord = require("discord.js");
const config = require("../config.json");
const admin = ["210392675478667269"]

module.exports.run = async (bot, message, dataSpecialChannel) => {
    if (message != null) {
        message.delete();
        message.channel.send("Arrêt du bot")
            .then(msg => {
                msg.delete({
                    timeout: 1500
                })
            });
    }
    bot.user.setActivity("Arrêt en cours", {
        type: "WATCHING"
    });

    const guildList = Array.from(bot.guilds.cache);
    guildList.forEach(element => {
        element = element[1];
        if (element.me.voice.channel) {
            element.me.voice.channel.join().then((connection) => {
                if (connection.dispatcher) {
                    connection.dispatcher.destroy();
                }
                connection.disconnect();
                element.me.voice.channel.leave();
            });
        }
    });

    await bot.basicFunctions.get("wait").run(2500);
    bot.destroy();
    bot.enventIndex.get("cronTab").stop(bot);

    await bot.basicFunctions.get("wait").run(5000);
    process.exit(0);
};


module.exports.help = {
    name: "destroy"
};

module.exports.manuel = {
    man: "man permet d'afficher le manuel d'une fonction\n" +
        "Pour ce faire il faut écrire dans le terminal:\n" +
        "`" + config.prefix + " man [nom de la commande]`"
};

module.exports.manuelview = {
    view: false
};