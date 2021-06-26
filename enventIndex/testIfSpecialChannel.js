module.exports.run = async (bot, message, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);

    bot.basicFunctions.get("dbDataSpecialTextChannel").select(bot, message.channel.id, (error, results, fields) => {
        if (error) throw error;

        if (results.length === 0) {
            callback(false);
            return;
        }

        dataSpecialChannel = results[0];
        bot["specialTextChannel"][dataSpecialChannel.type].get("index").run(bot, message, dataSpecialChannel);
        callback(true);
        return;
    });
};


module.exports.help = {
    name: "testIfSpecialChannel"
};