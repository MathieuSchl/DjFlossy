const Discord = require('discord.js');
const dataTrophy = require('../../dataTrophy.json');


async function sendNotification(bot, user, trophyName, trophyDescription) {
    const trophyEmbed = new Discord.MessageEmbed()
        .setColor('#30F1AE')
        .setTitle('Nouveau trophée obtenu')
        .setDescription('Vous avez obtenu un nouveau trophée:\n' +
            "Trophée : `" + trophyName + "`\n" +
            "Descrition : `" + trophyDescription + "`")
        .setTimestamp();

    user.send(trophyEmbed);
}

module.exports.run = async (bot, user, playlistName) => {
    bot.basicFunctions.get("dbUserAchievements").select(bot, user.id, (error, results, fields) => {
        if (error) throw error;
        const result = results[0];
        if (!result.data.secretPlaylist) result.data.secretPlaylist = {};
        if (!result.data.secretPlaylist[playlistName]) {
            if (!result.data.secretPlaylist.length) result.data.secretPlaylist.length = 0;
            result.data.secretPlaylist.length += 1;
            result.data.secretPlaylist[playlistName] = true;
            if ((!result.secretPlaylist_1) && result.data.secretPlaylist.length >= 1) {
                result.secretPlaylist_1 = bot.basicFunctions.get("getDateSqlFormat").run();
                const trophyName = dataTrophy.secretPlaylist_1["fr"].title;
                const trophyDescription = dataTrophy.secretPlaylist_1["fr"].description;
                sendNotification(bot, user, trophyName, trophyDescription);
            }
            if ((!result.secretPlaylist_3) && result.data.secretPlaylist.length >= 3) {
                result.secretPlaylist_3 = bot.basicFunctions.get("getDateSqlFormat").run();
                const trophyName = dataTrophy.secretPlaylist_3["fr"].title;
                const trophyDescription = dataTrophy.secretPlaylist_3["fr"].description;
                sendNotification(bot, user, trophyName, trophyDescription);
            }
            bot.basicFunctions.get("dbUserAchievements").update(bot, result, (error, results, fields) => {
                if (error) throw error;
            });
            return;
        }
        return;
    });
}

module.exports.help = {
    name: "achievementsRunSecretPlaylist"
};