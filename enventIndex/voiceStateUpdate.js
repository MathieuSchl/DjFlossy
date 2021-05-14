async function getVoiceChannelData(bot, guildId, oldVoiceChannelId, newVoiceChannelId, callback) {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ?? WHERE `id` = ?', [dbPrefix + "specialGuild", guildId], (error, results, fields) => {
        if (error) throw error;

        const result = results[0];
        const data = JSON.parse(result.data);
        const type = data.type;
        bot.basicFunctions.get("dbDataSpecialVoiceChannel").select(bot, oldVoiceChannelId, (error, results, fields) => {
            if (error) throw error;

            const oldDatavoiceChannel = results[0];

            bot.basicFunctions.get("dbDataSpecialVoiceChannel").select(bot, newVoiceChannelId, (error, results, fields) => {
                if (error) throw error;

                const newDatavoiceChannel = results[0];
                callback(oldDatavoiceChannel, newDatavoiceChannel, type);
            });
        });
    });
}

module.exports.run = async (bot, oldState, newState) => {
    getVoiceChannelData(bot, oldState.guild.id, oldState.channelID, newState.channelID, async (oldDatavoiceChannel, newDatavoiceChannel, type) => {
        bot.voiceStateFunctions.get("joinExitTimeStamp").run(bot, oldState, newState, oldDatavoiceChannel, newDatavoiceChannel);
        bot.voiceStateFunctions.get("userVoiceUpdate").run(bot, oldState, newState, oldDatavoiceChannel, newDatavoiceChannel);
        try {
            bot.voiceStateFunctions.get(type).run(bot, oldState, newState, oldDatavoiceChannel, newDatavoiceChannel);
        } catch (e) {
            //console.log(e);
            console.log(`Guild with type ${type} is unknown.`);
        }
    });
};


module.exports.help = {
    name: "voiceStateUpdate"
};