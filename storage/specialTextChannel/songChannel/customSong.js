const ytdl = require("ytdl-core");


function isString(data) {
    data = Number(data)
    if (data === parseInt(data, 10))
        return false;
    else
        return true;
}

async function verifyIfBotIsInVoiceChannel(bot, guild, author, data, callback) {
    if (guild.me.voice.channelID) callback();
    else {
        try {
            const authorId = author.id;
            const authorGuildMember = await guild.members.fetch(authorId);
            const voiceChannelToJoin = authorGuildMember.voice.channel ? authorGuildMember.voice.channel.id : data.musicChannel;
            if (voiceChannelToJoin) bot.musicFunctions.get("joinVoiceChannel").run(bot, voiceChannelToJoin);
            callback();
        } catch (e) {
            const voiceChannelToJoin = data.musicChannel;
            if (voiceChannelToJoin) bot.musicFunctions.get("joinVoiceChannel").run(bot, voiceChannelToJoin);
            callback();
        }
    }
}

async function updatePlaylist(bot, message, musicsTagList, passToTheNextSong) {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT `songsList`, `data` FROM ?? WHERE `id` = ?', [dbPrefix + "specialGuild", message.guild.id], (error, results, fields) => {
        if (error) throw error;

        const songsList = JSON.parse(results[0].songsList);
        const data = JSON.parse(results[0].data);

        verifyIfBotIsInVoiceChannel(bot, message.guild, message.author, data, async () => {
            if (passToTheNextSong == null) {
                if (!isString(songsList[0])) {
                    passToTheNextSong = true;
                } else {
                    passToTheNextSong = false;
                }
            }
            if (passToTheNextSong) songsList.splice(0, songsList.length);
            for (let index = 0; index < musicsTagList.length; index++) {
                const element = musicsTagList[index];
                songsList.push(element);
            }
            const songListParsed = JSON.stringify(songsList);
            bot.dataBase.get("connection").exec(bot.db, 'UPDATE ?? SET `songsList` = ? WHERE `id` = ?', [dbPrefix + "specialGuild", songListParsed, message.guild.id], async (error, results, fields) => {
                if (passToTheNextSong) {
                    const voiceChannel = message.guild.me.voice.channel;
                    const connection = message.guild.me.voice.connection;
                    if (voiceChannel, connection) bot.musicFunctions.get("startPlayingMusic").run(bot, voiceChannel, connection);
                }
            });
            return;
        })
    });
}

module.exports.run = async (bot, message, dataSpecialChannel) => {
    if (ytdl.validateID(message.content) || ytdl.validateURL(message.content)) {
        ytdl.getBasicInfo(message.content).then(async (info) => {
            updatePlaylist(bot, message, [info.videoDetails.videoId], null);
        }).catch((e) => {
            console.log(e);
        })
    }
    if (message.deletable) message.delete();
};

module.exports.updatePlaylist = async (bot, message, musicsTagList, passToTheNextSong) => {
    updatePlaylist(bot, message, musicsTagList, passToTheNextSong);
};

module.exports.help = {
    name: "customSong"
};