module.exports.addReaction = async (bot, reaction, user, messageData, index) => {
    const guildMember = await reaction.message.guild.members.fetch(user.id);
    const roleId = messageData.data.roles[index];
    guildMember.roles.add(roleId);
}

module.exports.removeReaction = async (bot, reaction, user, messageData, index) => {
    const guildMember = await reaction.message.guild.members.fetch(user.id);
    const roleId = messageData.data.roles[index];
    guildMember.roles.remove(roleId);
}

module.exports.help = {
    name: "index"
};