const system = "embedChannel";


module.exports.run = async (bot, message, dataSpecialChannel) => {
    message.delete();
    if (message.content !== "reload") return;
    const member = await message.guild.members.fetch(message.author);
    if (!member.hasPermission("ADMINISTRATOR")) return;

    bot.specialTextChannel[system].get("reload").run(bot, message.channel, dataSpecialChannel);
}

module.exports.help = {
    name: "index"
};