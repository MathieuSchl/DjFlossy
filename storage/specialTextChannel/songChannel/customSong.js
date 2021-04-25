const ytdl = require("ytdl-core");


function isString(data) {
    data = Number(data)
    if (data === parseInt(data, 10))
        return false;
    else
        return true;
}

module.exports.run = async (bot, message, dataSpecialChannel) => {
    if (ytdl.validateID(message.content) || ytdl.validateURL(message.content)) {
        ytdl.getBasicInfo(message.content).then(async (info) => {
            const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
            bot.dataBase.get("connection").exec(bot.db, 'SELECT `songsList`, `data` FROM ?? WHERE `id` = ?', [dbPrefix + "specialGuild", message.guild.id], (error, results, fields) => {
                if (error) throw error;

                const songsList = JSON.parse(results[0].songsList);
                const data = JSON.parse(results[0].data);
                let passToTheNextSong = false;
                if (isString(songsList[0])) {
                    songsList.push(info.videoDetails.videoId);
                } else {
                    songsList.splice(0, songsList.length)
                    songsList.push(info.videoDetails.videoId);
                    passToTheNextSong = true;
                }
                const songListParsed = JSON.stringify(songsList);
                bot.dataBase.get("connection").exec(bot.db, 'UPDATE ?? SET `songsList` = ? WHERE `id` = ?', [dbPrefix + "specialGuild", songListParsed, message.guild.id], async (error, results, fields) => {
                    if (passToTheNextSong) {
                        const voiceChannel = message.guild.me.voice.channel;
                        const connection = message.guild.me.voice.connection;
                        if (voiceChannel, connection) bot.musicFunctions.get("startPlayingMusic").run(bot, voiceChannel, connection);
                        else {
                            try {
                                const authorId = message.author.id;
                                const authorGuildMember = await message.guild.members.fetch(authorId);
                                const voiceChannelToJoin = authorGuildMember.voice.channel ? authorGuildMember.voice.channel.id : data.musicChannel;
                                if (voiceChannelToJoin) bot.musicFunctions.get("joinVoiceChannel").run(bot, voiceChannelToJoin);
                            } catch (e) {
                                const voiceChannelToJoin = data.musicChannel;
                                if (voiceChannelToJoin) bot.musicFunctions.get("joinVoiceChannel").run(bot, voiceChannelToJoin);
                            }
                        }
                    }
                });
                return;
            });
        }).catch((e) => {
            console.log(e);
        })
    }
    if (message.deletable) message.delete();
};

module.exports.help = {
    name: "customSong"
};