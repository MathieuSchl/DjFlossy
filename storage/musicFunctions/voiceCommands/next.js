module.exports.run = async (bot, connection, words, user) => {
    bot.messageSpecial.next.get("index").next(bot, connection.channel, user);
}

module.exports.test = (words) => {
    if ((words.length === 1) && (["texte", "next", "suivant"].includes(words[0].toLowerCase()))) return true;
    if ((words.length === 2) && (words[0].toLowerCase() === "musique" && words[1].toLowerCase() === "suivante")) return true;
    return false;
}

module.exports.help = {
    name: "next"
};