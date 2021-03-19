async function getVoiceChannelData(bot, oldVoiceChannelId, newVoiceChannelId, callback) {
    bot.basicFunctions.get("dbDataSpecialVoiceChannel").select(bot, oldVoiceChannelId, (error, results, fields) => {
        if (error) throw error;

        const oldDatavoiceChannel = results[0];

        bot.basicFunctions.get("dbDataSpecialVoiceChannel").select(bot, newVoiceChannelId, (error, results, fields) => {
            if (error) throw error;

            const newDatavoiceChannel = results[0];
            callback(oldDatavoiceChannel, newDatavoiceChannel);
            return;
        })
        return;
    })
    return;
}

module.exports.run = async (bot, oldState, newState) => {
    getVoiceChannelData(bot, oldState.channelID, newState.channelID, (oldDatavoiceChannel, newDatavoiceChannel) => {
        try {
            if (oldState.member.user.id === bot.user.id && oldState.channel && (oldState.channel.id !== newState.channel.id)) {
                oldState.channel.leave();
                newState.channel.join().then((connection) => {
                    if (connection.dispatcher) {
                        connection.dispatcher.destroy();
                    }
                });
            }
        } catch {}
        try {
            const botChannelId = oldState.guild.me.voice.channel.id;
            if (botChannelId === (oldState.channel ? oldState.channel.id : null) || botChannelId === (newState.channel ? newState.channel.id : null)) {
                const oldCount = oldState.channel ? Array.from(oldState.channel.members).length : 0;
                const newCount = newState.channel ? Array.from(newState.channel.members).length : 0;
                if (oldState.member.user.id === bot.user.id && oldState.channel && newState.channel && (oldState.channel.id !== newState.channel.id)) {
                    if (newCount > 1) {
                        bot.musicFunctions.get("startBotMusicInGuilds").one(bot, oldState.guild.id, (error, results, fields) => {
                            bot.musicFunctions.get("createPlaylist").run(bot, oldState.guild.id, () => {
                                bot.musicFunctions.get("joinVoiceChannel").run(bot, newState.channel.id);
                            });
                        });
                    }
                } else {
                    if (oldCount === 1 || newCount === 2) {
                        if (!((newState.selfDeaf !== oldState.selfDeaf) || (newState.selfMute !== oldState.selfMute) || (newState.serverDeaf !== oldState.serverDeaf) || (newState.serverMute !== oldState.serverMute))) {
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
    });
};


module.exports.help = {
    name: "voiceStateUpdate"
};