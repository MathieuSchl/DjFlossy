module.exports.add = async (bot, member, guildData) => {
    const tagNumbers = member.user.tag.split("#")[1];
    const username = member.user.username;

    member.setNickname(`CT-${tagNumbers} "${username}"`)
}

module.exports.remove = async (bot, member, guildData) => {

}

module.exports.help = {
    name: "index"
};