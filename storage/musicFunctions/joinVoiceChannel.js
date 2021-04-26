function afterJoin(bot, voiceChannel, connection) {
    connection.on("disconnect", () => {
        if (connection.dispatcher) connection.dispatcher.destroy();
    })

    if (Array.from(voiceChannel.members).length > 1) bot.musicFunctions.get("startPlayingMusic").run(bot, voiceChannel, connection);
    else {
        if (connection.dispatcher) connection.dispatcher.destroy();
        bot.musicFunctions.get("resetPlaylist").run(bot, voiceChannel.guild.id, () => {});
    }
}

module.exports.run = async (bot, channelId) => {
    const voiceChannel = await bot.channels.fetch(channelId);
    if (voiceChannel.type !== "voice") {
        const guild = voiceChannel.guild;
        const owner = await guild.members.fetch(guild.ownerID);
        owner.send(`I can't join the channel \`${voiceChannel.name}\` in the guild\`${guild}\`\n` +
            `The channel is not a \`voice channel\``);
        return;
    }
    const connection = voiceChannel.guild.me.voice.connection;
    if (connection) afterJoin(bot, voiceChannel, connection);
    else {
        voiceChannel.join()
            .then(async (connection) => {
                afterJoin(bot, voiceChannel, connection);
            }).catch((err) => {
                console.log("Error in join for music");
                console.log(err);
                console.log(err.code);
            });
    };
}

module.exports.help = {
    name: "joinVoiceChannel"
};