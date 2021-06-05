function getReactData(message) {
    reaction = Array.from(message.reactions.cache);
    for (let index = 0; index < reaction.length; index++) {
        const element = reaction[index];
        if (element[1].count > 1) return {
            "index": index,
            "emoji": element[1].emoji.name
        };
    }
    return null;
}

async function realoadConn(bot, connection, voiceChannel) {
    await connection.disconnect();
    await bot.basicFunctions.get("wait").run(1000);
    return await voiceChannel.join();
}


module.exports.addReaction = async (bot, reaction, user, messageData, index) => {
    reaction.users.remove(user.id);

    const channel = reaction.message.channel;
    channel.messages.fetch().then((messages) => {
        messages = Array.from(messages);

        let preDataChannel = {};
        let emojiVoiceType;
        for (let index = 0; index < messages.length; index++) {
            const element = messages[index][1];
            switch (element.embeds[0].title) {
                case "Liste des voiceType":
                    emojiVoiceType = getReactData(element);
                    break;
                case "Liste des serveurs":
                    preDataChannel = getReactData(element);
                    preDataChannel.messageid = element.id;
                    break;
            }
        }
        if (preDataChannel.index == null || emojiVoiceType == null) return;

        bot.basicFunctions.get("dbDataSpecialMessage").select(bot, preDataChannel.messageid, async (error, results, fields) => {
            if (error) throw error;
            if (results.length === 0) return;

            const messResult = results[0];
            const guild = await bot.guilds.fetch(messResult.data.idGuildsList[preDataChannel.index]);

            bot.basicFunctions.get("dbDataSpecialGuild").select(bot, guild.id, async (error, results, fields) => {
                if (error) throw error;
                if (results.length === 0) return;

                const guildResult = results[0];
                //const VC = bot.channels.fetch()
                if (!guild.voice) return;
                const voice = guild.voice;
                guildResult.ttsAvailable = false;
                guildResult.data.waitingTTS = [];

                if (guildResult.data.type === "TTS" && emojiVoiceType.emoji !== "🎙️") {
                    const channel = await bot.channels.fetch(guildResult.data.ttsChannel);
                    channel.delete();
                    delete guildResult.data.ttsChannel;
                }

                switch (emojiVoiceType.emoji) {
                    case "🎧":
                        if (guildResult.data.type === "DJ") return;
                        guildResult.data.type = "DJ";

                        if (voice.connection.dispatcher) voice.connection.dispatcher.end();
                        const voiceChannel = voice.channel;
                        bot.basicFunctions.get("dbDataSpecialGuild").update(bot, guildResult, async (error, results, fields) => {
                            if (error) throw error;

                            const connection = await realoadConn(bot, voice.connection, voiceChannel);
                            if (voiceChannel, connection) bot.musicFunctions.get("startPlayingMusic").run(bot, voiceChannel, connection);
                        })
                        break;

                    case "👮":
                        if (guildResult.data.type === "VL") return;
                        guildResult.data.type = "VL";

                        if (voice.connection.dispatcher) voice.connection.dispatcher.destroy();

                        bot.basicFunctions.get("dbDataSpecialGuild").update(bot, guildResult, async (error, results, fields) => {
                            if (error) throw error;

                            await realoadConn(bot, voice.connection, voice.channel);
                        })
                        break;

                    case "🎙️":
                        if (guildResult.data.type === "TTS") return;
                        guildResult.data.type = "TTS";

                        if (voice.connection.dispatcher) voice.connection.dispatcher.destroy();

                        reaction.message.guild.channels.create(guild.name, {
                            "type": "text",
                            "parent": reaction.message.channel.parentID
                        }).then((channel) => {
                            guildResult.data.ttsChannel = channel.id;

                            bot.basicFunctions.get("dbDataSpecialTextChannel").insert(bot, {
                                "id": channel.id,
                                "type": "TTS",
                                "data": {
                                    "guildId": guild.id
                                }
                            }, (error, results, fields) => {
                                if (error) throw error;

                                bot.basicFunctions.get("dbDataSpecialGuild").update(bot, guildResult, async (error, results, fields) => {
                                    if (error) throw error;

                                    await realoadConn(bot, voice.connection, voice.channel);
                                })
                            })
                        })
                        break;

                    case "🤖":
                        if (guildResult.data.type === "chloe") return;
                        guildResult.data.type = "chloe";

                        if (voice.connection.dispatcher) voice.connection.dispatcher.destroy();

                        bot.basicFunctions.get("dbDataSpecialGuild").update(bot, guildResult, async (error, results, fields) => {
                            if (error) throw error;

                            await realoadConn(bot, voice.connection, voice.connection.channel);
                        })
                        break;
                }
            })
        })
    })
}

module.exports.removeReaction = async (bot, reaction, user, messageData, index) => {}

module.exports.help = {
    name: "index"
};