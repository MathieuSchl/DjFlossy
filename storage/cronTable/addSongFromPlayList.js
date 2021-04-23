var CronJob = require('cron').CronJob;
const playlists = require("yt-playlist-scraper")
const name = "addSongFromPlayList"; //Set name here


async function addSong(bot, musicTag, playlists) {
    bot.dataBase.get("connection").exec(bot.db, 'SELECT 1 FROM ?? WHERE `tagName` = ?', ["musicsList", musicTag], (error, results, fields) => {
        if (error) throw error;

        if (results.length === 0) {
            bot.dataBase.get("connection").exec(bot.db, 'INSERT INTO ?? (`tagName`) VALUE (?)', ["musicsList", musicTag], (error, results, fields) => {
                if (error) throw error;

                bot.dataBase.get("connection").exec(bot.db, 'SELECT `id` FROM ?? WHERE `tagName` = ?', ["musicsList", musicTag], (error, results, fields) => {
                    if (error) throw error;

                    const idMusic = results[0].id;
                    playlists.forEach(element => {
                        bot.dataBase.get("connection").exec(bot.db, 'INSERT INTO ?? (`idTag`, `idMusic`) VALUES ( ?, ?)', ["musicsCorrelation", element, idMusic], (error, results, fields) => {
                            if (error) throw error;
                        });
                    });
                });
            });
        }
    });
}

module.exports.run = async (bot) => {

    //modify tour cron here

    const job = new CronJob('0 30 05 * * *', async function () {
        bot.dataBase.get("connection").exec(bot.db, 'SELECT `playListTag`, `playlist` FROM ??', ["playlistsList"], (error, results, fields) => {
            if (error) throw error;

            try {
                results.forEach(async (element) => {
                    const playListTag = element.playListTag;
                    const playlist = JSON.parse(element.playlist);

                    playlists(playListTag).then(async (playListData) => {
                        //const theLastXMusics = playListData.videos.length;
                        const theLastXMusics = 3;
                        for (let index = 0; index < theLastXMusics; index++) {
                            const element = playListData.videos[index];
                            addSong(bot, element.id, playlist);
                            await bot.basicFunctions.get("wait").run(1000);
                        }
                    });
                    await bot.basicFunctions.get("wait").run(10000);
                });
            } catch {}
        });
        job.stop();
    });

    //Stop


    return {
        "name": name,
        "job": job
    };
};


module.exports.help = {
    name: name
};