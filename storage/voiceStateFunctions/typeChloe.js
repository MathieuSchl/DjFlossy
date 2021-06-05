async function startChat(bot, connection) {
    const text = "Tous les systèmes sont en ligne et opérationnel";
    bot.textToSpeech.get("textToSpeech").run(bot, connection, text);
    bot.textToSpeech.get("listener").run(bot, connection, (voiceMessage, user) => {
        bot.textToSpeech.get("chatBot").run(bot, connection, voiceMessage, user);
    });
}

module.exports.run = async (bot, oldState, newState, oldDatavoiceChannel, newDatavoiceChannel) => {
    const theaction = await bot.voiceStateFunctions.get("userVoiceUpdate").detectTheAction(oldState, newState);
    //The bot is starting and bot user is already connect in voice channel
    if ((!theaction) && (oldState.member.user.id === bot.user.id)) startChat(bot, newState.guild.me.voice.connection);
    //The bot join or change voiceChannel
    else if ((theaction === "join" || theaction === "move") && (oldState.member.user.id === bot.user.id)) startChat(bot, newState.guild.me.voice.connection);
};


module.exports.help = {
    name: "chloe"
};