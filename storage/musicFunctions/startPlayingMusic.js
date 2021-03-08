const ytdl = require("ytdl-core");


async function getSong(bot, idSong, callback) {
    bot.dataBase.get("connection").exec('SELECT * FROM ?? WHERE id = ?', ["musicsList", idSong], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
}

module.exports.run = async (bot, voiceChannel, connection) => {
    bot.musicFunctions.get("getNextSongId").run(bot, voiceChannel.guild.id, async (idSong) => {
        getSong(bot, idSong, async (error, results, fields) => {
            if (error) throw error;

            const songData = results[0];
            if (songData == null) {
                console.log(`The song with id "${idSong}" does not exist`);
                return;
            }

            //console.log(await ytdl.getInfo(songData.tagName));

            const streamOptions = {
                volume: songData.volume
            };
            const stream = ytdl(songData.tagName, {
                quality: 'lowestaudio'
            });

            const dispatcher = connection.play(stream, streamOptions);

            dispatcher.on("finish", () => {
                dispatcher.destroy();
                bot.musicFunctions.get("startPlayingMusic").run(bot, voiceChannel, connection);
                return;
                //voiceChannel.leave();
            });

            dispatcher.on("error", (err) => {
                console.log("Error with the dispatcher");
                console.log(err);
                dispatcher.destroy();
                voiceChannel.leave();
            });
        });
    });
};

module.exports.help = {
    name: "startPlayingMusic"
};