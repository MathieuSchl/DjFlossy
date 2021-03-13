module.exports.run = async (bot, guild) => {
    bot.basicFunctions.get("dbDataSpecialGuild").select(bot, guild.id, (error, results, fields) => {
        if (error) throw error;

        const guildData = results[0];
        if (guildData.data.musicChannel) bot.basicFunctions.get("dbDataSpecialTextChannel").delete(bot, guildData.data.musicChannel, (error, results, fields) => {});
        if (guildData.data.pannel) bot.basicFunctions.get("dbDataSpecialTextChannel").delete(bot, guildData.data.pannel, (error, results, fields) => {});

        bot.basicFunctions.get("dbDataSpecialGuild").delete(bot, guild.id, (error, results, fields) => {});
    });
};


module.exports.help = {
    name: "botLeftAGuild"
};