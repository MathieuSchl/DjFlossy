const config = require('../../config.json');
const fs = require("fs");
const pathToAdd = config.location + "storage/data/"


module.exports.run = async (bot, message, dataSpecialChannel) => {
    let args = message.content.split(" ");
    const realpwd = pathToAdd + dataSpecialChannel.data.pwd;

    args.splice(0, 1);
    for (var i = 0; i < args.length; i++) {
        try {
            if (fs.existsSync(realpwd + args[i])) {
                fs.unlinkSync(realpwd + args[i])

                bot.specialTextChannel.dataCenter.get("ls").run(bot, message, dataSpecialChannel);
                await bot.basicFunctions.get("wait").run(1000);
                message.channel.send("Le fichier \"" + args[i] + "\" a été suprimé")
            } else {

                bot.specialTextChannel.dataCenter.get("ls").run(bot, message, dataSpecialChannel);
                await bot.basicFunctions.get("wait").run(1000);
                message.channel.send("Le fichier \"" + args[i] + "\" n'est pas valide")
            }
        } catch (err) {
            try {
                require('child_process').exec('rmdir ' + realpwd + args[i], async function (msg) {
                    bot.specialTextChannel.dataCenter.get("ls").run(bot, message, dataSpecialChannel);
                    await bot.basicFunctions.get("wait").run(1000);
                    message.channel.send("Le dossier \"" + args[i] + "\" a été suprimé")
                });
            } catch (err) {
                console.log("err")
            }
        }
    }
};

module.exports.help = {
    name: "rm"
};