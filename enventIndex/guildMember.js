async function getGuildData(bot, guildId, callback) {
    bot.basicFunctions.get("dbDataSpecialGuild").select(bot, guildId, (error, results, fields) => {
        if (error) throw error;

        const dataSpecialGuild = results[0];
        callback(dataSpecialGuild);
        return;
    })
    return;
}

module.exports.add = async (bot, member) => {
    getGuildData(bot, member.guild.id, (guildData) => {
        if (!guildData) return;

        for (let index = 0; index < guildData.actionAdd.length; index++) {
            const element = guildData.actionAdd[index];

            bot.specialGuilds[element].get("index").add(bot, member, guildData);
        }
    });
};

module.exports.remove = async (bot, member) => {
    getGuildData(bot, member.guild.id, (guildData) => {
        if (!guildData) return;

        for (let index = 0; index < guildData.actionRemove.length; index++) {
            const element = guildData.actionRemove[index];

            bot.specialGuilds[element].get("index").remove(bot, member, guildData);
        }
    });
};


module.exports.help = {
    name: "guildMember"
};