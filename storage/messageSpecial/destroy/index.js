module.exports.addReaction = async (bot, reaction, user, messageData, index) => {
    reaction.users.remove(user.id);

    const channel = reaction.message.channel;
    const member = await reaction.message.guild.members.fetch(user.id);
    if (!member.hasPermission("ADMINISTRATOR")) {
        reaction.message.channel.send("<@" + user.id + ">, tu n'est pas autorisé à utiliser cette commande 😊")
        return;
    }

    bot.commands.get("destroy").run(bot, null, channel);
}

module.exports.removeReaction = async (bot, reaction, user, messageData, index) => {}

module.exports.help = {
    name: "index"
};