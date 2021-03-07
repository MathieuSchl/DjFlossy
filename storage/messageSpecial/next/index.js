module.exports.addReaction = async (bot, reaction, user, messageData, index) => {
    reaction.users.remove(user.id);

    const member = await reaction.message.guild.members.fetch(user.id);
    const channel = reaction.message.guild.me.voice.channel;
    channel.join().then(async (connection) => {
        if (connection.dispatcher) connection.dispatcher.destroy();

        bot.musicFunctions.get("joinVoiceChannel").run(bot, channel.id);
    });
}

module.exports.removeReaction = async (bot, reaction, user, messageData, index) => {}

module.exports.help = {
    name: "index"
};