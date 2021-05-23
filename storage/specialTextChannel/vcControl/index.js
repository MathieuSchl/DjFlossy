const config = require('../../config.json');
const fs = require("fs");
const channelType = "vcControl";

module.exports.run = async (bot, message, dataSpecialChannel) => {
    //console.log(bot.specialChannel.game)
    let args = message.content.split(" ");

    try {
        bot.specialTextChannel[channelType].get(args[0]).run(bot, message, dataSpecialChannel);
    } catch (error) {
        //console.log(error)
        bot.specialTextChannel[channelType].get("reload").run(bot, message, dataSpecialChannel);
    }
}

module.exports.help = {
    name: "index"
};