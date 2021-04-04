module.exports.run = async (bot, idGuild, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db,'SELECT `songsList` FROM ?? WHERE `id` = ?', [dbPrefix + "specialGuild", idGuild], (error, results, fields) => {
        if (error) throw error;

        let data = results[0];
        data = JSON.parse(data.songsList);
        const actualSondId = data[0];
        if (!actualSondId) {
            bot.musicFunctions.get("createPlaylist").run(bot, idGuild, () => {
                bot.musicFunctions.get("getNextSongId").run(bot, idGuild, callback);
            });
            return;
        }
        data.splice(0, 1);
        data = JSON.stringify(data);

        bot.dataBase.get("connection").exec(bot.db,'UPDATE ?? SET `startingDate` = ? , `actualSongId` = ? , `songsList` = ? WHERE `id` = ?;', [dbPrefix + "specialGuild", new Date().toISOString(), actualSondId, data, idGuild], (error, results, fields) => {
            if (error) throw error;

            callback(actualSondId);
            return;
        });
        return;
    });
};

module.exports.help = {
    name: "getNextSongId"
};