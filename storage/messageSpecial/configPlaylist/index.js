const acceptedTypes = ["DJ"];


async function reloadPlayList(bot, guild) {
    const connection = guild.me.voice.connection;
    if (connection) {
        if (connection.dispatcher) connection.dispatcher.destroy();
        bot.musicFunctions.get("startBotMusicInGuilds").one(bot, guild.id, (error, results, fields) => {
            bot.musicFunctions.get("createPlaylist").run(bot, guild.id, () => {
                bot.musicFunctions.get("joinVoiceChannel").run(bot, guild.me.voice.channel.id);
            });
        });
    }
    return;
}

async function checkTheTypeOfTheGuild(bot, channel, callback) {
    const guildId = channel.guild.id;
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ?? WHERE `id` = ?', [dbPrefix + "specialGuild", guildId], (error, results, fields) => {
        if (error) throw error;

        const result = results[0];
        const data = JSON.parse(result.data);
        const type = data.type;
        if (acceptedTypes.includes(type)) callback();
        else {
            channel.send("C'est fonctionnalité n'est pas disponible pour le momment").then(async (msg) => {
                await bot.basicFunctions.get("wait").run(10000)
                if (msg.deletable) msg.delete();
            })
        }
    });
}

module.exports.addReaction = async (bot, reaction, user, messageData, index) => {
    checkTheTypeOfTheGuild(bot, reaction.message.channel, () => {
        reloadPlayList(bot, reaction.message.guild);
    });
    if (reaction.count >= 3) {
        const reactUsers = reaction.users
        reactUsers.fetch().then(async (users) => {
            users = Array.from(users);
            users.forEach(element => {
                if (element[0] !== bot.user.id) reactUsers.remove(element[0]);
            });
        })
    }
}

module.exports.removeReaction = async (bot, reaction, user, messageData, index) => {
    checkTheTypeOfTheGuild(bot, reaction.message.channel, () => {
        reloadPlayList(bot, reaction.message.guild);
    });
}

module.exports.help = {
    name: "index"
};