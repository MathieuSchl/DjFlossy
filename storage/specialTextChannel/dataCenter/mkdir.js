const config = require('../../config.json');
const fs = require("fs");
const pathToAdd = config.location + "storage/data/"


module.exports.run = async (bot, message, dataSpecialChannel)=>{
    let args = message.content.split(" ");
    const realpwd = pathToAdd + dataSpecialChannel.data.pwd;

    require('child_process').exec('mkdir '+realpwd+args[1], function (msg) { console.log(msg) });

    await bot.basicFunctions.get("wait").run(100);
    bot.specialTextChannel.dataCenter.get("ls").run(bot,message,dataSpecialChannel);
};

module.exports.help = {
    name: "mkdir"
};