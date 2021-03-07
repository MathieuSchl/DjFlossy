const config = require('../../config.json');
const fs = require("fs");

module.exports.run = async (bot, message, dataSpecialChannel) => {
    //console.log(bot.specialChannel.game)
    let args = message.content.split(" ");

    try {
        if (Array.from(message.attachments.keys()).length !== 0) {
            bot.specialTextChannel.dataCenter.get("giveFiles").run(bot, message, dataSpecialChannel);
        } else {
            bot.specialTextChannel.dataCenter.get(args[0]).run(bot, message, dataSpecialChannel);
        }
    } catch (error) {
        //console.log(error)
        bot.specialTextChannel.dataCenter.get("ls").run(bot, message, dataSpecialChannel);
    }
}

module.exports.help = {
    name: "index"
};