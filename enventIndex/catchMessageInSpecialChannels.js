const config = require("../storage/config.json");
const fs = require("fs");
const pathSpecialMessages = config.location + "/storage/data/specialMessageList/";
const pathSpecialGuilds = config.location + "/storage/data/specialGuild/";
const pathSpecialVoiceChannels = config.location + "/storage/data/specialVoiceChannelList/";

module.exports.run = async (bot) => {
    const allGuilds = bot.guilds.cache.array();

    for (let index = 0; index < allGuilds.length; index++) {
        const element = allGuilds[index];
        if (element.rulesChannelID != null) {
            channel = await bot.channels.fetch(element.rulesChannelID);
            channel.messages.fetch();
        }
    }

    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    await bot.basicFunctions.get("wait").run(3000);

    bot.dataBase.get("connection").exec('SELECT * FROM ??', [dbPrefix + "specialTextChannel"], async (error, results, fields) => {
        if (error) throw error;

        for (let index = 0; index < results.length; index++) {
            const element = results[index];

            try{
                await bot.channels.fetch(element.id);
            }catch{
                bot.basicFunctions.get("dbDataSpecialTextChannel").delete(bot, element.id, (error, results, fields)=>{});
            }
        }
        return;
    });

    await bot.basicFunctions.get("wait").run(3000);

    bot.dataBase.get("connection").exec('SELECT * FROM ??', [dbPrefix + "specialMessage"], async (error, results, fields) => {
        if (error) throw error;

        for (let i = 0; i < results.length; i++) {
            let dataSpecialMessage = results[i];

            try {
                let channel = await bot.channels.fetch(dataSpecialMessage.channel);
                channel.messages.fetch(dataSpecialMessage.id).catch((e) => {
                    console.log(e);
                });
            } catch {
                bot.basicFunctions.get("dbDataSpecialMessage").delete(bot, dataSpecialMessage.id, (error, results, fields)=>{});
            }
        }
        return;
    });



    await bot.basicFunctions.get("wait").run(3000);

    bot.dataBase.get("connection").exec('SELECT * FROM ??', [dbPrefix + "specialGuild"], async (error, results, fields) => {
        if (error) throw error;

        for (let i = 0; i < results.length; i++) {
            try {
                await bot.guilds.fetch(results[i].id);
            } catch (e) {
                bot.basicFunctions.get("dbDataSpecialGuild").delete(bot, results[i].id, (error, results, fields)=>{});
            }
        }
        return;
    });


    
    await bot.basicFunctions.get("wait").run(3000);

    bot.dataBase.get("connection").exec('SELECT * FROM ??', [dbPrefix + "specialVoiceChannel"], async (error, results, fields) => {
        if (error) throw error;

        for (let i = 0; i < results.length; i++) {
            let dataSpecialVoiceChannel = results[i];

            try {
                await bot.channels.fetch(dataSpecialVoiceChannel.id);
            } catch {
                bot.basicFunctions.get("dbDataSpecialVoiceChannel").delete(bot, dataSpecialVoiceChannel.id, (error, results, fields)=>{});
            }
        }
        return;
    });


    const channelsToFetch = require("../storage/data/generalData.json").channelsToFetch;
    channelsToFetch.forEach(async (element) => {
        const channel = await bot.channels.fetch(element);
        channel.messages.fetch();
    });
};


module.exports.help = {
    name: "catchMessageInSpecialChannels"
};