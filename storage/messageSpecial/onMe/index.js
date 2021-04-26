const acceptedTypes = ["DJ"];


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

function start(bot, guildId, channelId) {
    bot.musicFunctions.get("startBotMusicInGuilds").one(bot, guildId, (error, results, fields) => {
        bot.musicFunctions.get("createPlaylist").run(bot, guildId, () => {
            bot.musicFunctions.get("joinVoiceChannel").run(bot, channelId);
        });
    });
}

module.exports.addReaction = async (bot, reaction, user, messageData, index) => {
    reaction.users.remove(user.id);

    checkTheTypeOfTheGuild(bot, reaction.message.channel, async () => {
        const member = await reaction.message.guild.members.fetch(user.id);
        const channel = member.voice.channel;
        if (channel) {
            const voiceState = reaction.message.guild.me.voice;
            if (voiceState.channel) {
                const connection = voiceState.connection;
                if (connection.dispatcher) connection.dispatcher.destroy();
                connection.disconnect();

                start(bot, reaction.message.guild.id, channel.id);
            } else {
                start(bot, reaction.message.guild.id, channel.id);
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