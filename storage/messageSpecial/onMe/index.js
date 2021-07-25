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

async function onMe(bot, channel, user) {
    checkTheTypeOfTheGuild(bot, channel, async (type) => {
        const member = await channel.guild.members.fetch(user.id);
        const memberVcChannel = member.voice.channel;
        if (memberVcChannel) {
            const voiceState = memberVcChannel.guild.me.voice;
            if (voiceState.connection) {
                const connection = voiceState.connection;
                if (connection.dispatcher) connection.dispatcher.destroy();
                connection.disconnect();

                start(bot, memberVcChannel.guild.id, memberVcChannel.id, type);
            } else {
                start(bot, memberVcChannel.guild.id, memberVcChannel.id, type);
            }
        } else {
            if (["dm", "text"].includes(channel.type)) {
                channel.send("<@" + user.id + "> tu n'es pas dans un salon vocal.").then(async (msg) => {
                    await bot.basicFunctions.get("wait").run(5000);
                    if (msg.deletable) msg.delete();
                })
            }
        }
    });
}

module.exports.addReaction = async (bot, reaction, user, messageData, index) => {
    reaction.users.remove(user.id);

    onMe(bot, reaction.message.channel, user);
}

module.exports.removeReaction = async (bot, reaction, user, messageData, index) => {}

module.exports.onMe = async (bot, channel, user) => {
    onMe(bot, channel, user);
}

module.exports.help = {
    name: "index"
};