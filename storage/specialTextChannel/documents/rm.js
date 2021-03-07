const config = require('../../config.json');
const fs = require("fs");
const pathToAdd = config.location + "storage/data/documentsChannel/"


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

    let args = message.content.split(" ");
    if(args.length<2){
        message.channel.send("Merci de renseigner le fichier à suprimer:  rm [fileName]").then(msg => {msg.delete({ timeout: 5000 })});
        return;
    }
    
    const folder = message.channel.id;
    const pwd = pathToAdd + folder + "/";
    args.splice(0, 1);
    for (var i = 0; i < args.length; i++) {
        try {
            if (fs.existsSync(pwd + args[i])) {
                fs.unlinkSync(pwd + args[i])
                await bot.specialTextChannel.documents.get("reload").run(bot, message, dataSpecialChannel);
                await bot.basicFunctions.get("wait").run(10000);
                message.channel.send("Le fichier \"" + args[i] + "\" a été suprimé").then(async (msg) => {
                    await bot.basicFunctions.get("wait").run(10000);
                    if (!msg.deleted) msg.delete();
                });
            } else {
                message.channel.send("Le fichier \"" + args[i] + "\" n'est pas valide").then(async (msg) => {
                    await bot.basicFunctions.get("wait").run(10000);
                    if (!msg.deleted) msg.delete();
                });
            }
        } catch (err) {
            console.log(err)
        }
    }
};

module.exports.help = {
    name: "rm"
};