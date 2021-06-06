module.exports.run = async (bot, oldState, newState, oldDatavoiceChannel, newDatavoiceChannel) => {
    const theAction = await bot.voiceStateFunctions.get("userVoiceUpdate").detectTheAction(oldState, newState);

    const guild = newState.guild;
    const connection = oldState.guild.me.voice.connection;
    if (!connection) return;
    const time = new Date();
    //console.log(theAction);
    switch (theAction) {
        case 'serverMute':
            bot.voiceStateFunctions.get("userVoiceUpdate").readLogs(guild, time, {
                "actionType": "MEMBER_UPDATE",
                "actionDetails": "mute"
            }, async (executor, target) => {
                const executorName = executor.nickname ? executor.nickname : executor.user.username;
                const targetName = target.nickname ? target.nickname : target.user.username;
                const textToRead = `${executorName} a rendu muet ${targetName}`;
                bot.textToSpeech.get("textToSpeech").run(bot, connection, textToRead);
            });
            break;
        case 'serverUnMute':
            bot.voiceStateFunctions.get("userVoiceUpdate").readLogs(guild, time, {
                "actionType": "MEMBER_UPDATE",
                "actionDetails": "mute"
            }, async (executor, target) => {
                const executorName = executor.nickname ? executor.nickname : executor.user.username;
                const targetName = target.nickname ? target.nickname : target.user.username;
                const textToRead = `${executorName} a rétabli la voix de ${targetName}`;
                bot.textToSpeech.get("textToSpeech").run(bot, connection, textToRead);
            });
            break;
        case 'serverDeaf':
            bot.voiceStateFunctions.get("userVoiceUpdate").readLogs(guild, time, {
                "actionType": "MEMBER_UPDATE",
                "actionDetails": "deaf"
            }, async (executor, target) => {
                const executorName = executor.nickname ? executor.nickname : executor.user.username;
                const targetName = target.nickname ? target.nickname : target.user.username;
                const textToRead = `${executorName} a mis en sourdine ${targetName}`;
                bot.textToSpeech.get("textToSpeech").run(bot, connection, textToRead);
            });
            break;
        case 'serverUnDeaf':
            bot.voiceStateFunctions.get("userVoiceUpdate").readLogs(guild, time, {
                "actionType": "MEMBER_UPDATE",
                "actionDetails": "deaf"
            }, async (executor, target) => {
                const executorName = executor.nickname ? executor.nickname : executor.user.username;
                const targetName = target.nickname ? target.nickname : target.user.username;
                const textToRead = `${executorName} a rétabli le son de ${targetName}`;
                bot.textToSpeech.get("textToSpeech").run(bot, connection, textToRead);
            });
            break;
        case 'selfMute':
            const selfMuteUserName = newState.member.nickname ? newState.member.nickname : newState.member.user.username;
            const selfMuteText = `${selfMuteUserName} a coupé son micro`;
            bot.textToSpeech.get("textToSpeech").run(bot, connection, selfMuteText);
            break;
        case 'selfUnMute':
            const selfUnMuteUserName = newState.member.nickname ? newState.member.nickname : newState.member.user.username;
            const selfUnMuteText = `${selfUnMuteUserName} a réactivé son micro`;
            bot.textToSpeech.get("textToSpeech").run(bot, connection, selfUnMuteText);
            break;
        case 'selfDeaf':
            const selfDeafUserName = newState.member.nickname ? newState.member.nickname : newState.member.user.username;
            const selfDeafText = `${selfDeafUserName} a coupé son casque`;
            bot.textToSpeech.get("textToSpeech").run(bot, connection, selfDeafText);
            break;
        case 'selfUnDeaf':
            const selfUnDeafUserName = newState.member.nickname ? newState.member.nickname : newState.member.user.username;
            const selfUnDeafText = `${selfUnDeafUserName} a réactivé son casque`;
            bot.textToSpeech.get("textToSpeech").run(bot, connection, selfUnDeafText);
            break;
        case 'startVideo':
            const startVideoUserName = newState.member.nickname ? newState.member.nickname : newState.member.user.username;
            const startVideoText = `${startVideoUserName} a activé sa caméra`;
            bot.textToSpeech.get("textToSpeech").run(bot, connection, startVideoText);
            break;
        case 'endVideo':
            const endVideoUserName = newState.member.nickname ? newState.member.nickname : newState.member.user.username;
            const endVideoText = `${endVideoUserName} a coupé sa caméra`;
            bot.textToSpeech.get("textToSpeech").run(bot, connection, endVideoText);
            break;
        case 'startStreaming':
            const startStreamingUserName = newState.member.nickname ? newState.member.nickname : newState.member.user.username;
            const voiceChannelName = newState.channel.name;
            const startStreamingText = `${startStreamingUserName} a démarré un stream dans le channel ${voiceChannelName}`;
            bot.textToSpeech.get("textToSpeech").run(bot, connection, startStreamingText);
            break;
        case 'endStreaming':
            const endStreamingUserName = newState.member.nickname ? newState.member.nickname : newState.member.user.username;
            const endStreamingText = `${endStreamingUserName} a arrêté son stream`;
            bot.textToSpeech.get("textToSpeech").run(bot, connection, endStreamingText);
            break;
        case 'disconnect':
            bot.voiceStateFunctions.get("userVoiceUpdate").readLogs(guild, time, {
                "actionType": "MEMBER_DISCONNECT"
            }, async (executor) => {
                const targetName = oldState.member.nickname ? oldState.member.nickname : oldState.member.user.username;
                if (executor) {
                    const executorName = executor.nickname ? executor.nickname : executor.user.username;
                    const voiceChannelName = oldState.channel.name;
                    const textToRead = `${executorName} a déconnecté ${targetName} du salon vocal ${voiceChannelName}`;
                    bot.textToSpeech.get("textToSpeech").run(bot, connection, textToRead);
                } else {
                    const targetName = oldState.member.nickname ? oldState.member.nickname : oldState.member.user.username;
                    const voiceChannelName = oldState.channel.name;
                    const textToRead = `${targetName} s'est déconnecté du salon vocal ${voiceChannelName}`;
                    bot.textToSpeech.get("textToSpeech").run(bot, connection, textToRead);
                }
            });
            break;
        case 'join':
            bot.voiceStateFunctions.get("userVoiceUpdate").readLogs(guild, time, {
                "actionType": "MEMBER_DISCONNECT"
            }, async () => {
                const targetName = oldState.member.nickname ? oldState.member.nickname : oldState.member.user.username;
                const voiceChannelName = newState.channel.name;
                const textToRead = `${targetName} a rejoin le salon vocal ${voiceChannelName}`;
                bot.textToSpeech.get("textToSpeech").run(bot, connection, textToRead);
            });
            break;
        default:
            //console.log(theAction);
            return;
    }
};


module.exports.help = {
    name: "VL"
};