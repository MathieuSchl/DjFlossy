const config = require('../../config.json');
const fs = require("fs");

module.exports.run = async (bot, message, dataSpecialChannel) => {
    //console.log(bot.specialChannel.game)
    let args = message.content.split(" ");

    try {
        bot.specialTextChannel.dataCenter.get(args[0]).run(bot, message, dataSpecialChannel);
    } catch (error) {
        console.log(error)
        bot.specialTextChannel.dataCenter.get("delete").run(bot, message, dataSpecialChannel);
    }
}

module.exports.help = {
    name: "index"
};