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
        const theaction = await bot.voiceStateFunctions.get("userVoiceUpdate").detectTheAction(oldState, newState);
        const oldCount = oldState.channel ? Array.from(oldState.channel.members).length : 0;
        const newCount = newState.channel ? Array.from(newState.channel.members).length : 0;
        const meChannelId = newState.guild.me.voice.channelID;

        if ((!theaction) && (oldState.member.user.id === bot.user.id)) {
            //The bot is starting and bot user is already connect in voice channel
            bot.musicFunctions.get("startBotMusicInGuilds").one(bot, oldState.guild.id, (error, results, fields) => {
                bot.musicFunctions.get("createPlaylist").run(bot, oldState.guild.id, () => {
                    bot.musicFunctions.get("joinVoiceChannel").run(bot, newState.channel.id);
                });
            });

            await bot.basicFunctions.get("wait").run(5000);
            console.log("start listenner");
            //start listenner
        } else if (!meChannelId) {
            bot.basicFunctions.get("dbDataSpecialGuild").select(bot, newState.guild.id, async (error, results, fields) => {
                if (error) throw error;

                const result = results[0];
                if ((result.actualSongId) || result.songsList === "[]") {
                    result.actualSongId = null;
                    result.songsList = "[]";
                    bot.basicFunctions.get("dbDataSpecialGuild").update(bot, result, (error, results, fields) => {
                        if (error) throw error;
                    })
                }
                await bot.basicFunctions.get("wait").run(7500);
                if (newState.guild.me.voice.channelID) return;
                const musicChannel = await bot.channels.fetch(result.data.musicChannel);
                const memberCount = Array.from(musicChannel.members).length
                if (memberCount === 0) {
                    musicChannel.join();
                }
            })
        } else {
            if ((theaction === "join" || theaction === "move") && (newState.channelID === meChannelId)) {
                if (newCount === 2) {
                    bot.musicFunctions.get("startBotMusicInGuilds").one(bot, oldState.guild.id, (error, results, fields) => {
                        bot.musicFunctions.get("createPlaylist").run(bot, oldState.guild.id, () => {
                            bot.musicFunctions.get("joinVoiceChannel").run(bot, newState.channel.id);
                        });
                    });
                }
                if (oldState.member.user.id === bot.user.id) {
                    await bot.basicFunctions.get("wait").run(5000);
                    console.log("start listenner");
                    //start listenner
                }
            }
            //A user leave the voiceChannel
            else if ((theaction === "disconnect" || theaction === "move") && (oldState.channelID === meChannelId) && (oldCount === 1)) {

                bot.basicFunctions.get("dbDataSpecialGuild").select(bot, newState.guild.id, async (error, results, fields) => {
                    if (error) throw error;

                    const result = results[0];
                    if (result.data.musicChannel === meChannelId) {
                        //The bot is in the music voice Channel
                        bot.musicFunctions.get("startBotMusicInGuilds").one(bot, oldState.guild.id, (error, results, fields) => {
                            bot.musicFunctions.get("createPlaylist").run(bot, oldState.guild.id, () => {
                                bot.musicFunctions.get("joinVoiceChannel").run(bot, oldState.channel.id);
                            });
                        });
                    } else {
                        //The bot is not in the music voice Channel
                        const connection = newState.guild.me.voice.connection;
                        if (connection.dispatcher) connection.dispatcher.end();
                        connection.disconnect();
                    }
                });
            }
        }

        return;



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