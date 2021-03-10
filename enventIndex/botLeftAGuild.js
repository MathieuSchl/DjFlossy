module.exports.run = async (bot, guild) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec('DELETE FROM ?? WHERE `id` = ?', [dbPrefix + "specialGuild", guild.id], (error, results, fields) => {});

};


module.exports.help = {
    name: "botLeftAGuild"
};