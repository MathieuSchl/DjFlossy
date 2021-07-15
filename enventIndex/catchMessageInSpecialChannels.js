const config = require("../storage/config.json");

module.exports.run = async (bot) => {
    const allGuilds = bot.guilds.cache.array();

    for (let index = 0; index < allGuilds.length; index++) {
        const element = allGuilds[index];
        if (element.rulesChannelID != null) {
            channel = await bot.channels.fetch(element.rulesChannelID);
            await channel.messages.fetch();
        }
    }

    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);

    await new Promise((resolve, reject) => {
        bot.basicFunctions.get("dbDataSpecialTextChannel").selectAll(bot, async (error, results, fields) => {
            if (error) throw error;

            for (let index = 0; index < results.length; index++) {
                const element = results[index];

                try {
                    await bot.channels.fetch(element.id);
                } catch {
                    bot.basicFunctions.get("dbDataSpecialTextChannel").delete(bot, element.id, (error, results, fields) => {});
                }
            }
            resolve();
            return;
        });
    })



    await new Promise((resolve, reject) => {
        bot.basicFunctions.get("dbDataSpecialMessage").selectAll(bot, async (error, results, fields) => {
            if (error) throw error;

            for (let i = 0; i < results.length; i++) {
                let dataSpecialMessage = results[i];

                try {
                    let channel = await bot.channels.fetch(dataSpecialMessage.channel);
                    channel.messages.fetch(dataSpecialMessage.id).catch((e) => {
                        bot.basicFunctions.get("dbDataSpecialMessage").delete(bot, dataSpecialMessage.id, (error, results, fields) => {});
                    });
                } catch {
                    bot.basicFunctions.get("dbDataSpecialMessage").delete(bot, dataSpecialMessage.id, (error, results, fields) => {});
                }
            }
            resolve()
            return;
        });
    })


    await new Promise((resolve, reject) => {
        bot.basicFunctions.get("dbDataSpecialGuild").selectAll(bot, async (error, results, fields) => {
            if (error) throw error;

            for (let i = 0; i < results.length; i++) {
                try {
                    await bot.guilds.fetch(results[i].id);
                } catch (e) {
                    bot.basicFunctions.get("dbDataSpecialGuild").delete(bot, results[i].id, (error, results, fields) => {});
                }
            }
            resolve()
            return;
        });
    })


    await new Promise((resolve, reject) => {
        bot.basicFunctions.get("dbDataSpecialVoiceChannel").selectAll(bot, async (error, results, fields) => {
            if (error) throw error;

            for (let i = 0; i < results.length; i++) {
                let dataSpecialVoiceChannel = results[i];

                try {
                    await bot.channels.fetch(dataSpecialVoiceChannel.id);
                } catch {
                    bot.basicFunctions.get("dbDataSpecialVoiceChannel").delete(bot, dataSpecialVoiceChannel.id, (error, results, fields) => {});
                }
            }
            resolve()
            return;
        });
    })
};


module.exports.help = {
    name: "catchMessageInSpecialChannels"
};