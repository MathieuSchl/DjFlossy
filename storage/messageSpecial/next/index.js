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

module.exports.addReaction = async (bot, reaction, user, messageData, index) => {
    reaction.users.remove(user.id);


    checkTheTypeOfTheGuild(bot, reaction.message.channel, async () => {
        const voiceState = reaction.message.guild.me.voice;
        const connection = voiceState.connection;
        const channel = voiceState.channel;
        if (connection) {
            if (connection.dispatcher) connection.dispatcher.destroy();
            bot.musicFunctions.get("joinVoiceChannel").run(bot, channel.id);
        }
    });
}

module.exports.removeReaction = async (bot, reaction, user, messageData, index) => {}

module.exports.help = {
    name: "index"
};