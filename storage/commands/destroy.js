const config = require("../config.json");
const admin = ["210392675478667269"]

module.exports.run = async (bot, message, channel) => {
    if (message != null) {
        message.delete();
        if (!admin.includes(message.author.id)) {
            message.channel.send("Tu n'es pas autorisé à faire ca !").then(async (msg) => {
                await bot.basicFunctions.get("wait").run(10000);
                if (!msg.deleted) msg.delete();
            })
            return;
        }
        channel = message.channel;
    }
    if (channel != null) {
        channel.send("Arrêt du bot")
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
            const connection = element.me.voice.connection;
            if (connection) {
                if (connection.dispatcher) {
                    connection.dispatcher.destroy();
                }
                connection.disconnect();
                element.me.voice.channel.leave();
            }
        }
    });

    await bot.basicFunctions.get("wait").run(2500);
    bot.destroy();
    bot.db.end();
    bot.enventIndex.get("cronTab").stop(bot);

    await bot.basicFunctions.get("wait").run(5000);
    process.exit(0);
};


module.exports.help = {
    name: "destroy"
};