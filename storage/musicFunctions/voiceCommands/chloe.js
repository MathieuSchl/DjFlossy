const dataTrophy = require("../../dataTrophy.json");


async function realoadConn(bot, connection, voiceChannel) {
    if (connection.dispatcher) connection.dispatcher.end();
    await connection.disconnect();
    await bot.basicFunctions.get("wait").run(1000);
    return await voiceChannel.join();
}

module.exports.run = async (bot, connection, words, user) => {
    const idUser = user.id;

    bot.basicFunctions.get("dbDataSpecialGuild").select(bot, connection.channel.guild.id, async (error, results, fields) => {
        if (error) throw error;
        if (results.length === 0) return;

        const guildResult = results[0];
        guildResult.data.type = "chloe";

        bot.basicFunctions.get("dbDataSpecialGuild").update(bot, guildResult, async (error, results, fields) => {
            if (error) throw error;

            const newConnection = await realoadConn(bot, connection, connection.channel);

            bot.basicFunctions.get("dbUserAchievements").select(bot, idUser, (error, results, fields) => {
                if (error) throw error;
                const result = results[0];
                if (result.easterEgg_Chloe == null) {
                    const title = dataTrophy.easterEgg_Chloe["fr"].title.replace('<BOTTAG>', bot.user.username);
                    const description = dataTrophy.easterEgg_Chloe["fr"].description.replace('<BOTTAG>', bot.user.username);
                    result.easterEgg_Chloe = bot.basicFunctions.get("getDateSqlFormat").run();
                    sendNotification(bot, idUser, title, description);
                    bot.basicFunctions.get("dbUserAchievements").update(bot, result, (error, results, fields) => {
                        if (error) throw error;
                    })
                }
            });
        })
    })
}

module.exports.test = (words) => {
    if (words.length !== 2) return false;
    if (words[1].toLowerCase() !== "chloé") return false;
    return true;
}

module.exports.help = {
    name: "chloe"
};