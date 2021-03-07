
module.exports.run = async (bot, message, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);

    bot.dataBase.get("connection").exec('SELECT * FROM ?? WHERE id = ?', [dbPrefix + "specialTextChannel", message.channel.id], (error, results, fields) => {
        if (error) throw error;

        if (results.length === 0) {
            callback(false);
            return;
        }

        results.map(element => element.data = JSON.parse(element.data));
        dataSpecialChannel = results[0];
        bot["specialTextChannel"][dataSpecialChannel.type].get("index").run(bot, message, dataSpecialChannel);
        callback(true);
        return;
    });
};


module.exports.help = {
    name: "testIfSpecialChannel"
};