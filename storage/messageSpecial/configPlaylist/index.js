async function reloadPlayList(bot, guild) {
    guild.me.voice.channel.join().then((con) => {
        if (con.dispatcher) con.dispatcher.destroy();
        bot.musicFunctions.get("startBotMusicInGuilds").one(bot, guild.id, (error, results, fields) => {
            bot.musicFunctions.get("createPlaylist").run(bot, guild.id, () => {
                bot.musicFunctions.get("joinVoiceChannel").run(bot, guild.me.voice.channel.id);
            });
        });
    })
    return;
}


module.exports.addReaction = async (bot, reaction, user, messageData, index) => {
    reloadPlayList(bot, reaction.message.guild);
    if (reaction.count >= 3) {
        const reactUsers = reaction.users
        reactUsers.fetch().then(async (users) => {
            users = Array.from(users);
            users.forEach(element => {
                if (element[0]!==bot.user.id) reactUsers.remove(element[0]);
            });
        })
    }
}

module.exports.removeReaction = async (bot, reaction, user, messageData, index) => {
    reloadPlayList(bot, reaction.message.guild);
}

module.exports.help = {
    name: "index"
};