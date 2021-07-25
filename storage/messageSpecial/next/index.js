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
            if (["dm", "text"].includes(channel.type)) {
                channel.send("C'est fonctionnalité n'est pas disponible pour le momment").then(async (msg) => {
                    await bot.basicFunctions.get("wait").run(10000)
                    if (msg.deletable) msg.delete();
                })
            }
        }
    });
}

async function next(bot, channel, user) {
    checkTheTypeOfTheGuild(bot, channel, async () => {
        const meChannelId = channel.guild.me.voice.channelID;
        const member = await channel.guild.members.fetch(user.id);
        if (member.voice.channelID === meChannelId) {
            const voiceState = channel.guild.me.voice;
            const connection = voiceState.connection;
            const vcChannel = voiceState.channel;
            if (connection) {
                if (connection.dispatcher) connection.dispatcher.destroy();
                bot.musicFunctions.get("joinVoiceChannel").run(bot, vcChannel.id);
            }
        }
    });
}

module.exports.addReaction = async (bot, reaction, user, messageData, index) => {
    reaction.users.remove(user.id);

    next(bot, reaction.message.channel, user);
}

module.exports.removeReaction = async (bot, reaction, user, messageData, index) => {}

module.exports.next = async (bot, channel, user) => {
    next(bot, channel, user);
}

module.exports.help = {
    name: "index"
};