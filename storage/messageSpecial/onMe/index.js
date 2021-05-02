const acceptedTypes = ["DJ"];


async function checkTheTypeOfTheGuild(bot, channel, callback) {
    const guildId = channel.guild.id;
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ?? WHERE `id` = ?', [dbPrefix + "specialGuild", guildId], (error, results, fields) => {
        if (error) throw error;

        const result = results[0];
        const data = JSON.parse(result.data);
        const type = data.type;
        callback(type);
        /*
        if (acceptedTypes.includes(type)) callback();
        else {
            channel.send("C'est fonctionnalité n'est pas disponible pour le momment").then(async (msg) => {
                await bot.basicFunctions.get("wait").run(10000)
                if (msg.deletable) msg.delete();
            })
        }
        */
    });
}

async function start(bot, guildId, channelId, type) {
    const channel = await bot.channels.fetch(channelId);
    const voiceState = channel.guild.me.voice;
    if (!voiceState.connection) {
        if (type === "DJ") {
            bot.musicFunctions.get("startBotMusicInGuilds").one(bot, guildId, (error, results, fields) => {
                bot.musicFunctions.get("createPlaylist").run(bot, guildId, () => {
                    bot.musicFunctions.get("joinVoiceChannel").run(bot, channelId);
                });
            });
        } else {
            await bot.basicFunctions.get("wait").run(1000)
            channel.join();
        }
    }
}

module.exports.addReaction = async (bot, reaction, user, messageData, index) => {
    reaction.users.remove(user.id);

    checkTheTypeOfTheGuild(bot, reaction.message.channel, async (type) => {
        const member = await reaction.message.guild.members.fetch(user.id);
        const channel = member.voice.channel;
        if (channel) {
            const voiceState = channel.guild.me.voice;
            if (voiceState.connection) {
                const connection = voiceState.connection;
                if (connection.dispatcher) connection.dispatcher.destroy();
                connection.disconnect();

                start(bot, reaction.message.guild.id, channel.id, type);
            } else {
                start(bot, reaction.message.guild.id, channel.id, type);
            }
        } else {
            reaction.message.channel.send("<@" + user.id + "> tu n'es pas dans un salon vocal.").then(async (msg) => {
                await bot.basicFunctions.get("wait").run(5000);
                if (msg.deletable) msg.delete();
            })
        }
    });
}

module.exports.removeReaction = async (bot, reaction, user, messageData, index) => {}

module.exports.help = {
    name: "index"
};