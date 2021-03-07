module.exports.add = async (bot, member, guildData) => {
    const guild = member.guild;
    const listIdRolesToAdd = guildData.data.rolesId;
    member.roles.add(listIdRolesToAdd).catch(async() => {
        const owner = await guild.members.fetch(guild.ownerID);
        owner.send(`I can't add all roles when a user joins the guild: \`${guild}\``);
    });
}

module.exports.remove = async (bot, member, guildData) => {

}

module.exports.help = {
    name: "index"
};