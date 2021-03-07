async function resetAllPlaylist(bot, callback) {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec('UPDATE ?? SET `actualSongId` = NULL , `songsList` = \'[]\'', [dbPrefix + "specialGuild"], (error, results, fields) => {

        callback(error, results, fields);
        return;
    });
}

async function getAllGuilds(bot, callback) {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec('SELECT * FROM ??', [dbPrefix + "specialGuild"], (error, results, fields) => {
        for (let index = 0; index < results.length; index++) {
            results[index].actionAdd = JSON.parse(results[index].actionAdd);
            results[index].actionRemove = JSON.parse(results[index].actionRemove);
            results[index].songsList = JSON.parse(results[index].songsList);
            results[index].data = JSON.parse(results[index].data);
        }

        callback(error, results, fields);
        return;
    });
}

module.exports.run = async (bot) => {
    resetAllPlaylist(bot, (error, results, fields) => {
        if (error) throw error;

        getAllGuilds(bot, async (error, results, fields) => {
            if (error) throw error;

            for (let index = 0; index < results.length; index++) {
                const element = results[index];

                bot.musicFunctions.get("createPlaylist").run(bot, element.id, () => {
                    bot.musicFunctions.get("joinVoiceChannel").run(bot, element.data.musicChannel);
                });
                await bot.basicFunctions.get("wait").run(500);
            }
        });
    })
}

module.exports.one = async (bot, guildId, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec('UPDATE ?? SET `actualSongId` = NULL , `songsList` = \'[]\' WHERE `id` = ?', [dbPrefix + "specialGuild", guildId], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
}

module.exports.help = {
    name: "startBotMusicInGuilds"
};