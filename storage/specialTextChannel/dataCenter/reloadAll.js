module.exports.run = async (bot, message, dataSpecialChannel) => {
    if (message.deletable) message.delete();

    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, "SELECT id FROM ?? WHERE type = 'songChannel'", [dbPrefix + "specialTextChannel"], async (error, results, fields) => {
        if (error) throw error;

        results.forEach(async (element) => {
            const channel = await bot.channels.fetch(element.id);
            bot.specialTextChannel.songChannel.get("reload").reload(bot, channel);
        });
    });
};

module.exports.help = {
    name: "reloadAll"
};