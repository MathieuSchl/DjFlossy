module.exports.run = async (bot, message, dataSpecialChannel) => {
    bot.specialTextChannel["git"].get("pull").run(bot, message, dataSpecialChannel);
};

module.exports.help = {
    name: "pull"
};