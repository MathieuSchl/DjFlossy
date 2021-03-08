module.exports.run = async (bot, channelId) => {
    const voiceChannel = await bot.channels.fetch(channelId);
    if (voiceChannel.type !== "voice") {
        const guild = voiceChannel.guild;
        const owner = await guild.members.fetch(guild.ownerID);
        owner.send(`I can't join the channel \`${voiceChannel.name}\` in the guild\`${guild}\`\n` +
            `The channel is not a \`voice channel\``);
        return;
    }
    voiceChannel.join()
        .then(async (connection) => {
            if(Array.from(voiceChannel.members).length>1) bot.musicFunctions.get("startPlayingMusic").run(bot, voiceChannel, connection);
            else{
                if (connection.dispatcher) connection.dispatcher.destroy();
                bot.musicFunctions.get("resetPlaylist").run(bot, voiceChannel.guild.id, ()=>{});
            }
        }).catch((err) => {
            console.log("Error in join for music");
            console.log(err);
        })
}

module.exports.help = {
    name: "joinVoiceChannel"
};