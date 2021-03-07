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
    await bot.basicFunctions.get("wait").run(2500);
    bot.destroy();
    bot.enventIndex.get("cronTab").stop(bot);
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