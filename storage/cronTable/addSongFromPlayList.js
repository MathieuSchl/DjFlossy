const config = require("../config.json")
var CronJob = require('cron').CronJob;
const Discord = require('discord.js');
const name = "addSongFromPlayList"; //Set name here
const ytdl = require("ytdl-core");
const ytch = require('yt-channel-info')


async function testChannelInfo(authorId) {
    try {
        await ytch.getChannelInfo(authorId);
        return true;
    } catch {
        return false;
    }
}

async function sendMusicsInfo(bot, channel, tagName, playlists) {
    const ytInfo = await ytdl.getInfo(tagName);

    const URL = ytInfo.videoDetails.video_url;
    const avatarURL = await testChannelInfo(ytInfo.videoDetails.author.id) ? (await ytch.getChannelInfo(ytInfo.videoDetails.author.id)).authorThumbnails[2].url : null;

    const musicEmbed = new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setTitle(ytInfo.videoDetails.title)
        .setURL(URL)
        .setAuthor(ytInfo.videoDetails.author.name, avatarURL, ytInfo.videoDetails.author.channel_url)
        .setImage(ytInfo.videoDetails.thumbnails[2].url)
        .setTimestamp()
        .setFooter(bot.user.tag, await bot.user.avatarURL());

    await new Promise(async (resolve) => {
        if (playlists == null || playlists.length === 0) {
            resolve();
            return;
        }

        let query = "SELECT `name` FROM ??";
        let options = ["musicTag"];

        for (let index = 0; index < playlists.length; index++) {
            const element = playlists[index];
            if (index === 0) query = query + " WHERE `id` = ?";
            else query = query + " OR `id` = ?";
            options.push(element);
        }

        const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
        bot.dataBase.get("connection").exec(bot.db, query, options, async (error, results, fields) => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                bot.dataBase.get("connection").createTable(dbPrefix, "musicTag");
                resolve();
                return;
            } else if (error) throw error;
            else if (results == null || results.length === 0) {
                resolve();
                return;
            }
            musicEmbed.setDescription("Musique ajouté dans les playlists:\n");
            for (let index = 0; index < results.length; index++) {
                const element = results[index];
                musicEmbed.setDescription(musicEmbed.description + "-`" + element.name + "`\n");
            }

            resolve();
            return;
        });
    })
    channel.send(musicEmbed)
}

async function addSong(bot, musicTag, playlists) {
    bot.dataBase.get("connection").exec(bot.db, 'SELECT 1 FROM ?? WHERE `tagName` = ?', ["musicsList", musicTag], (error, results, fields) => {
        if (error) throw error;

        if (results.length === 0) {
            bot.dataBase.get("connection").exec(bot.db, 'INSERT INTO ?? (`tagName`) VALUE (?)', ["musicsList", musicTag], (error, results, fields) => {
                if (error) throw error;

                bot.dataBase.get("connection").exec(bot.db, 'SELECT `id` FROM ?? WHERE `tagName` = ?', ["musicsList", musicTag], async (error, results, fields) => {
                    if (error) throw error;

                    const channel = await bot.channels.fetch(config.idNewSongsChannel);
                    sendMusicsInfo(bot, channel, musicTag, playlists)

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

                    bot.basicFunctions.get("getVideosFromYtPlaylist").run(playListTag, async (playListTags) => {
                        //const theLastXMusics = playListData.videos.length;
                        const theLastXMusics = 3;
                        for (let index = 0; index < theLastXMusics && index < playListTags.length; index++) {
                            const element = playListTags[index];
                            addSong(bot, element, playlist);
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