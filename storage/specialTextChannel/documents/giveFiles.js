const config = require('../../config.json');
const fs = require("fs");
let request = require(`request`);
const pathToAdd = config.location + "storage/data/documentsChannel/";

function roleVerifAuthorisation(bot, user, guild, dataSpecialChannel) {
    let userRoles = guild.member(user)["_roles"];
    for (let role of dataSpecialChannel["data"]["textChannelAdmin"]) {
        for (var userRole = 0; userRole < userRoles.length; userRole++) {
            if (role === userRoles[userRole]) {
                return true;
            }
        }
    }
    return false;
}

module.exports.run = async (bot, message, dataSpecialChannel) => {
    if (!roleVerifAuthorisation(bot, message.author, message.guild, dataSpecialChannel)) {
        message.delete();
        message.channel.send("Vous n'êtes pas autorisé à rajouter des fichiers ici").then(async (msg) => {
            await bot.basicFunctions.get("wait").run(10000);
            if (!msg.deleted) msg.delete();
        });
        return;
    }
    const folder = message.channel.id;
    const pwd = pathToAdd + folder + "/";

    var attachmentsKeys = Array.from(message.attachments.keys());

    for (let index = 0; index < attachmentsKeys.length; index++) {
        const url = message.attachments.get(attachmentsKeys[0]).url;
        const name = message.attachments.get(attachmentsKeys[0]).name;

        request.get(url)
            .on('error', console.error)
            .pipe(fs.createWriteStream(pwd + name));

        await bot.basicFunctions.get("wait").run(1000);
    }
    bot.specialTextChannel.documents.get("reload").run(bot, message, dataSpecialChannel);
};

module.exports.help = {
    name: "giveFiles"
};