

module.exports.run = async (bot, message, dataSpecialChannel) => {
    const member = await message.guild.members.fetch(message.author.id);
    if(!member.hasPermission("ADMINISTRATOR")){
        message.delete().catch();
        message.reply("tu n'est pas autorisé à utiliser cette commande 😊")
        return;
    }

    bot.commands.get("destroy").run(bot, message, dataSpecialChannel);
    return;
}

module.exports.help = {
    name: "destroy"
};