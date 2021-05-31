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
                    volume: songData.volume
                };
                const videoData = await ytdl.getInfo(songData.tagName);
                const stream = ytdl(songData.tagName, {
                    quality: 'lowestaudio',
                    filter: 'audioonly'
                })

                const dispatcher = connection.play(stream, streamOptions);

                dispatcher.on("finish", () => {
                    dispatcher.destroy();
                    bot.musicFunctions.get("startPlayingMusic").run(bot, voiceChannel, connection);
                    return;
                    //voiceChannel.leave();
                });

                dispatcher.on("error", (err) => {
                    console.log("Error with the dispatcher");
                    console.log(err.code);
                    console.log("\n\n");
                    console.log(err);

                    dispatcher.destroy();
                    if (!err.code) {
                        console.log("--------------");
                        console.log(songData.tagName);
                        bot.musicFunctions.get("startPlayingMusic").run(bot, voiceChannel, connection);
                        return;
                    }
                    voiceChannel.leave();
                });

                //Security to destroy dispatcher
                await bot.basicFunctions.get("wait").run(videoData.videoDetails.lengthSeconds * 1100);
                if (!dispatcher["_writableState"].ended) {
                    dispatcher.destroy();
                    bot.musicFunctions.get("startPlayingMusic").run(bot, voiceChannel, connection);
                }

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