

async function getMessageAfterNuke(bot) {
    mess = "Bienvenue sur le channel pour utiliser les commandes du bot <@" + bot.user.id + ">\n" +
        "Les commandes pour le bot doivent commencer par `$`\n" +
        "Pour avoir la liste des commandes faites `!help`";
    return mess;
}

module.exports.run = async (bot, message, dataSpecialChannel) => {
    const member = await message.guild.members.fetch(message.author.id);
    if (!member.hasPermission("ADMINISTRATOR")) {
        message.delete().catch();
        message.reply("tu n'est pas autorisé à utiliser cette commande")
        return;
    }

    message.channel.messages.fetch().then(async (messages) => {
        await messages.array().reverse().forEach(msg => {
            msg.delete().catch(() => {});
        });
        await bot.basicFunctions.get("wait").run(250);
        await message.channel.send(await getMessageAfterNuke(bot)).then((msg) => {
            msg.pin();
        })
        await bot.basicFunctions.get("wait").run(500);
        message.channel.lastMessage.delete().catch(() => {});
    })
    return;
}

module.exports.help = {
    name: "nuke"
};