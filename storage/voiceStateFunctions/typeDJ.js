async function checkDeafAndMute(oldState, newState) {
    if (oldState.member.user.id === oldState.guild.client.user.id) {
        if ((oldState.selfDeaf == null) || (oldState.selfMute == null) || (oldState.serverDeaf == null) || (oldState.serverMute == null) || (oldState.streaming == null) || (oldState.selfVideo == null)) return true;
        if ((newState.selfDeaf !== oldState.selfDeaf) || (newState.selfMute !== oldState.selfMute) || (newState.serverDeaf !== oldState.serverDeaf) || (newState.serverMute !== oldState.serverMute) || (newState.streaming !== oldState.streaming) || (newState.selfVideo !== oldState.selfVideo)) return false;
        return true;
    }
    if (!((newState.selfDeaf !== oldState.selfDeaf) || (newState.selfMute !== oldState.selfMute) || (newState.serverDeaf !== oldState.serverDeaf) || (newState.serverMute !== oldState.serverMute) || (newState.streaming !== oldState.streaming) || (newState.selfVideo !== oldState.selfVideo))) return true;
    return false;
}

module.exports.run = async (bot, oldState, newState, oldDatavoiceChannel, newDatavoiceChannel) => {
    try {
        if (oldState.member.user.id === bot.user.id && oldState.channel && (oldState.channel.id !== newState.channel.id)) {
            oldState.channel.leave();
            const connection = newState.connection;
            if (connection) {
                if (connection.dispatcher) {
                    connection.dispatcher.destroy();
                }
            }
        }
    } catch {}
    try {
        const oldCount = oldState.channel ? Array.from(oldState.channel.members).length : 0;
        const newCount = newState.channel ? Array.from(newState.channel.members).length : 0;

        const botChannelId = oldState.guild.me.voice.channel.id;
        if (botChannelId === (oldState.channel ? oldState.channel.id : null) || botChannelId === (newState.channel ? newState.channel.id : null)) {
            if ((oldState.member.user.id === bot.user.id) && oldState.channel && newState.channel && (oldState.channel.id !== newState.channel.id)) {
                if (newCount > 1) {
                    bot.musicFunctions.get("startBotMusicInGuilds").one(bot, oldState.guild.id, (error, results, fields) => {
                        bot.musicFunctions.get("createPlaylist").run(bot, oldState.guild.id, () => {
                            bot.musicFunctions.get("joinVoiceChannel").run(bot, newState.channel.id);
                        });
                    });
                }
            } else {
                if (oldCount === 1 || newCount === 2) {
                    if (await checkDeafAndMute(oldState, newState)) {
                        bot.musicFunctions.get("startBotMusicInGuilds").one(bot, oldState.guild.id, (error, results, fields) => {
                            bot.musicFunctions.get("createPlaylist").run(bot, oldState.guild.id, () => {
                                if (oldState.guild.me.voice.channel) bot.musicFunctions.get("joinVoiceChannel").run(bot, oldState.guild.me.voice.channel.id);
                            });
                        });
                    }
                }
            }
        }
    } catch {}
    if (oldDatavoiceChannel) {
        try {
            bot.specialVoiceChannels[oldDatavoiceChannel.type].get("index").leave(bot, oldState, oldDatavoiceChannel, newState, newDatavoiceChannel);
        } catch {
            console.log("The specialVoiceChannels '" + oldDatavoiceChannel.type + "'does not exist");
        }
    }

    if (newDatavoiceChannel) {
        try {
            bot.specialVoiceChannels[newDatavoiceChannel.type].get("index").join(bot, oldState, oldDatavoiceChannel, newState, newDatavoiceChannel);
        } catch {
            console.log("The specialVoiceChannels '" + newDatavoiceChannel.type + "'does not exist");
        }
    }
};


module.exports.help = {
    name: "DJ"
};