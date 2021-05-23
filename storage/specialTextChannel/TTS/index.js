module.exports.run = async (bot, message, dataSpecialChannel) => {
    const guild = await bot.guilds.fetch(dataSpecialChannel.data.guildId);
    const connection = guild.voice ? guild.voice.connection : null;
    if(!connection) return;
    bot.textToSpeech.get("textToSpeech").run(bot, connection, message.content);
}

module.exports.help = {
    name: "index"
};