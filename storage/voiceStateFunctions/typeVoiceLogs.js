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
            const textToRead = `Cette action n'a pas été reconnu`;
            return;
    }
};


module.exports.help = {
    name: "VL"
};