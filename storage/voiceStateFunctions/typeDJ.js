const Discord = require('discord.js');
const dataTrophy = require('../dataTrophy.json');


async function sendNotification(bot, idUser, trophyName, trophyDescription) {
    const user = await bot.users.fetch(idUser);

    const trophyEmbed = new Discord.MessageEmbed()
        .setColor('#30F1AE')
        .setTitle('Nouveau trophée obtenu')
        .setDescription('Vous avez obtenu un nouveau trophée:\n' +
            "Trophée : `" + trophyName + "`\n" +
            "Descrition : `" + trophyDescription + "`")
        .setTimestamp();

    user.send(trophyEmbed);
}

async function realoadConn(bot, connection, voiceChannel) {
    if (connection.dispatcher) connection.dispatcher.end();
    await connection.disconnect();
    await bot.basicFunctions.get("wait").run(1000);
    return await voiceChannel.join();
}

async function startListener(bot, connection) {
    if (!connection) return;
    bot.textToSpeech.get("listener").run(bot, connection, (voiceMessage, user) => {
        const idUser =user.id;
        const words = voiceMessage.split(" ");
        if (words.length !== 2) return;
        if (words[1].toLowerCase() !== "chloé") return;

        bot.basicFunctions.get("dbDataSpecialGuild").select(bot, connection.channel.guild.id, async (error, results, fields) => {
            if (error) throw error;
            if (results.length === 0) return;

            const guildResult = results[0];
            guildResult.data.type = "chloe";

            bot.basicFunctions.get("dbDataSpecialGuild").update(bot, guildResult, async (error, results, fields) => {
                if (error) throw error;

                const newConnection = await realoadConn(bot, connection, connection.channel);

                bot.basicFunctions.get("dbUserAchievements").select(bot, idUser, (error, results, fields) => {
                    if (error) throw error;
                    const result = results[0];
                    if (result.easterEgg_Chloe == null) {
                        const title = dataTrophy.easterEgg_Chloe["fr"].title.replace('<BOTTAG>', bot.user.username);
                        const description = dataTrophy.easterEgg_Chloe["fr"].description.replace('<BOTTAG>', bot.user.username);
                        result.easterEgg_Chloe = bot.basicFunctions.get("getDateSqlFormat").run();
                        sendNotification(bot, idUser, title, description);
                        bot.basicFunctions.get("dbUserAchievements").update(bot,result,(error, results, fields)=>{
                            if (error) throw error;
                        })
                    }
                });
            })
        })
    })
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
            //start listenner
            startListener(bot, newState.guild.me.voice.connection);
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
                    //start listenner
                    startListener(bot, newState.guild.me.voice.connection);
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