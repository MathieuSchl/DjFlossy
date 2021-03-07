module.exports.add = async (bot, member, guildData) => {
    const mess = guildData.data.welcomeMessage;
    member.send(mess);
}

module.exports.remove = async (bot, member, guildData) => {

}

module.exports.help = {
    name: "index"
};