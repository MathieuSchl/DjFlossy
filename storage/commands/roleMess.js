const Discord = require("discord.js");
const config = require("../config.json");

async function removeEmojis(string) {
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

    return (string.replace(regex, '')!==string);
}

module.exports.run = async (bot, message, dataSpecialChannel) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
        message.delete();
        message.channel.send("Vous n'êtes pas autorisé à faire ceci").then(async (msg) => {
            await bot.basicFunctions.get("wait").run(10000);
            if (!msg.deleted) msg.delete();
        });
        return;
    }

    const args = message.content.split(" ");

    if (args.length <= 2) {
        message.delete();
        message.channel.send("Merci de renseinger un argument").then(async (msg) => {
            await bot.basicFunctions.get("wait").run(10000);
            if (!msg.deleted) msg.delete();
        });
        return;
    }

    switch (args[2]) {
        case 'new':
            bot.basicFunctions.get("specialMessageFiles").createAddRoleEmbed(bot, message.channel);
            break;
        case 'addRole':
            if (args.length <= 4) {
                message.delete();
                message.channel.send("Merci de renseinger un emoji et de tager un role").then(async (msg) => {
                    await bot.basicFunctions.get("wait").run(10000);
                    if (!msg.deleted) msg.delete();
                });
                return;
            }
            console.log(args[3]);
            console.log(args[4]);

            console.log(await removeEmojis(args[3]));


            break;
        default:
            message.channel.send("Commande '" + args[2] + "' inconnu").then(async (msg) => {
                await bot.basicFunctions.get("wait").run(10000);
                if (!msg.deleted) msg.delete();
            });
    }

    if (!message.deleted) message.delete();
};


module.exports.help = {
    name: "roleMess"
};