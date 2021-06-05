const ytdl = require("ytdl-core");


function isString(data) {
    if (data === parseInt(data, 10))
        return false;
    else
        return true;
}

async function getSong(bot, idSong, callback) {
    if (isString(idSong)) {
        callback(null, [{
            "id": -1,
            "tagName": idSong,
            "volume": 1
        }], null);
        return;
    }
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ?? WHERE id = ?', ["musicsList", idSong], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
}

module.exports.run = async (bot, voiceChannel, connection) => {
    bot.musicFunctions.get("getNextSongId").run(bot, voiceChannel.guild.id, async (idSong) => {
        getSong(bot, idSong, async (error, results, fields) => {
            try {
                if (error) throw error;

                const songData = results[0];
                if (songData == null) {
                    console.log(`The song with id "${idSong}" does not exist`);
                    return;
                }

                const streamOptions = {
                    volume: songData.volume * 0.08
                };
                const videoData = await ytdl.getInfo(songData.tagName);
                const stream = ytdl(songData.tagName, {
                    quality: 'lowestaudio',
                    filter: 'audioonly'
                })

                const dispatcher = connection.play(stream, streamOptions);

                dispatcher.on("finish", () => {
                    dispatcher.end();
                    bot.musicFunctions.get("startPlayingMusic").run(bot, voiceChannel, connection);
                    return;
                    //voiceChannel.leave();
                });

                dispatcher.on("error", (err) => {
                    console.log("Error with the dispatcher");
                    console.log(err.code);
                    console.log("\n\n");
                    console.log(err);

                    dispatcher.end();
                    if (!err.code) {
                        console.log("--------------");
                        console.log(songData.tagName);
                        bot.musicFunctions.get("startPlayingMusic").run(bot, voiceChannel, connection);
                        return;
                    }
                    voiceChannel.leave();
                });

                //Security to end the dispatcher

                await bot.basicFunctions.get("wait").run((parseInt(videoData.videoDetails.lengthSeconds) + 10) * 1000);

                bot.basicFunctions.get("dbDataSpecialGuild").select(bot, voiceChannel.guild.id, (error, results, fields) => {
                    if (error) throw error;

                    if (idSong === results[0].actualSongId) {
                        dispatcher.end();
                        bot.musicFunctions.get("startPlayingMusic").run(bot, voiceChannel, connection);
                    }
                })
            } catch (e) {
                console.log("Error in startPlayingMusic");
                console.log(e);
                bot.musicFunctions.get("startPlayingMusic").run(bot, voiceChannel, connection);
            }
        });
    });
};

module.exports.help = {
    name: "startPlayingMusic"
};