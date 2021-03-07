const Discord = require("discord.js");
const config = require('../../config.json');
const fs = require("fs");
let request = require(`request`);
const pathToAdd = config.location + "storage/data/";


module.exports.run = async (bot, message, dataSpecialChannel) => {
    const realpwd = pathToAdd + dataSpecialChannel.data.pwd;

    var attachmentsKeys = Array.from(message.attachments.keys());

    for (let index = 0; index < attachmentsKeys.length; index++) {
        const url = message.attachments.get(attachmentsKeys[0]).url;
        const name = message.attachments.get(attachmentsKeys[0]).name;


        request.get(url)
            .on('error', console.error)
            .pipe(fs.createWriteStream(realpwd + name));

        await bot.basicFunctions.get("wait").run(1000);
    }

    await bot.basicFunctions.get("wait").run(100);
    bot.specialTextChannel.dataCenter.get("ls").run(bot, message, dataSpecialChannel);
};

module.exports.help = {
    name: "giveFiles"
};