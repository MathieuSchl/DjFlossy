module.exports.addReaction = async (bot, reaction, user, messageData, index) => {
    reaction.users.remove(user.id);

    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ??', [dbPrefix + "specialGuild"], async (error, results, fields) => {
        if (error) throw error;

        for (let index = 0; index < results.length; index++) {
            const element = results[index];
            const data = JSON.parse(element.data);
            const channelId = data.pannel;
            const channel = await bot.channels.fetch(channelId);
            bot.specialTextChannel.songChannel.get("reload").reload(bot, channel);
        }
    });
}

module.exports.removeReaction = async (bot, reaction, user, messageData, index) => {}

module.exports.help = {
    name: "index"
};