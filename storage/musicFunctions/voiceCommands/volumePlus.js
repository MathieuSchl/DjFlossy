const config = require("../../config.json");


module.exports.run = async (bot, connection, words, user) => {
    if (config.idBotAdmins.includes(user.id)) {
        bot.basicFunctions.get("dbDataSpecialGuild").select(bot, connection.channel.guild.id, (error, results, fields) => {
            if (error) throw error;

            const result = results[0];
            result.songsList = JSON.parse(result.songsList);
            result.actualSongId = JSON.parse(result.actualSongId);

            result.songsList.unshift(result.actualSongId);

            bot.basicFunctions.get("dbDataSpecialGuild").update(bot, result, (error, results, fields) => {
                if (error) throw error;

                bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ?? WHERE `id` = ?', ["musicsList", result.actualSongId], (error, results, fields) => {
                    if (error) throw error;

                    const song = results[0];
                    bot.dataBase.get("connection").exec(bot.db, 'UPDATE ?? SET `volume` = ? WHERE `id` = ?', ["musicsList", song.volume + 0.25, song.id], (error, results, fields) => {
                        if (error) throw error;

                        const song = results[0];
                        bot.messageSpecial.next.get("index").next(bot, connection.channel, user);
                    })
                    bot.messageSpecial.next.get("index").next(bot, connection.channel, user);
                })
            });
        });
    }
}

module.exports.test = (words) => {
    if ((words.length === 2) && (["volume", "plus"].includes(words[0].toLowerCase()) && ["fort", "plus"].includes(words[1].toLowerCase()))) return true;
    return false;
}

module.exports.help = {
    name: "volumePlus"
};