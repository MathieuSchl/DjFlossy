module.exports.run = async (bot, connection, words, user) => {
    bot.messageSpecial.onMe.get("index").onMe(bot, connection.channel, user);
}

module.exports.test = (words) => {
    if ((words.length === 1) && (["reconnecte"].includes(words[0].toLowerCase()))) return true;
    return false;
}

module.exports.help = {
    name: "reconnect"
};