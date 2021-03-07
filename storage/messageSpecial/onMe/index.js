module.exports.addReaction = async (bot, reaction, user, messageData, index) => {
    reaction.users.remove(user.id);

    const member = await reaction.message.guild.members.fetch(user.id);
    const channel = member.voice.channel;
    if (channel) {
        reaction.message.guild.me.voice.channel.join().then(async (connection) => {
            if (connection.dispatcher) connection.dispatcher.destroy();
            connection.disconnect();


            bot.musicFunctions.get("startBotMusicInGuilds").one(bot, reaction.message.guild.id, (error, results, fields) => {
                bot.musicFunctions.get("createPlaylist").run(bot, reaction.message.guild.id, () => {
                    bot.musicFunctions.get("joinVoiceChannel").run(bot, channel.id);
                });
            });
        });
    }else{
        reaction.message.channel.send("<@" + user.id + "> tu n'es pas dans un salon vocal.").then(async (msg) => {
            await bot.basicFunctions.get("wait").run(5000);
            if(msg.deletable) msg.delete();
        })
    }
}

module.exports.removeReaction = async (bot, reaction, user, messageData, index) => {}

module.exports.help = {
    name: "index"
};