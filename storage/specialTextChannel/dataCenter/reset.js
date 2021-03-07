


module.exports.run = async (bot, message, dataSpecialChannel) => {
    dataSpecialChannel.data.pwd = "/";
    bot.basicFunctions.get("dbDataSpecialTextChannel").update(bot, dataSpecialChannel, (error, results, fields) => {
        if (error) throw error;
    });

    await bot.basicFunctions.get("wait").run(250);
    bot.specialTextChannel.dataCenter.get("ls").run(bot, message, dataSpecialChannel);
};

module.exports.help = {
    name: "reset"
};