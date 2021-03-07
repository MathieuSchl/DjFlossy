module.exports.run = async (bot, idGuild, callback) => {
    bot.dataBase.get("connection").exec('UPDATE ?? SET `songsList` = ? WHERE `id` = ?;', [dbPrefix + "specialGuild", "[]", idGuild], (error, results, fields) => {
        if (error) throw error;

        callback(error, results, fields);
        return;
    });
}

module.exports.help = {
    name: "resetPlaylist"
};