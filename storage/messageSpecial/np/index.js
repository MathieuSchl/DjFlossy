const ytdl = require("ytdl-core");
const Discord = require('discord.js');
const ytch = require('yt-channel-info')
const acceptedTypes = ["DJ"];


async function checkTheTypeOfTheGuild(bot, channel, callback) {
    const guildId = channel.guild.id;
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ?? WHERE `id` = ?', [dbPrefix + "specialGuild", guildId], (error, results, fields) => {
        if (error) throw error;

        const result = results[0];
        const data = JSON.parse(result.data);
        const type = data.type;
        if (acceptedTypes.includes(type)) callback();
        else {
            channel.send("C'est fonctionnalité n'est pas disponible pour le momment").then(async (msg) => {
                await bot.basicFunctions.get("wait").run(10000)
                if (msg.deletable) msg.delete();
            })
        }
    });
}

async function testChannelInfo(authorId) {
    try {
        await ytch.getChannelInfo(authorId);
        return true;
    } catch {
        return false;
    }
}

async function meMeastiure(ms) {
    let d, h, m, s;
    s = ms / 1000;
    ms = ms % 1000;
    m = s / 60;
    s = s % 60;
    h = m / 60;
    m = m % 60;
    d = h / 24;
    h = h % 24;

    s = Math.trunc(s);
    m = Math.trunc(m);
    h = Math.trunc(h);
    d = Math.trunc(d);

    return [d, h, m, s, ms];
};

async function convertIntToStringTime(time) {
    const allTime = await meMeastiure(time * 1000);
    let res = "";
    if (allTime[0] !== 0) res = `${("0" + allTime[0]).slice(-2)} days ${("0" + allTime[1]).slice(-2)}:${("0" + allTime[2]).slice(-2)}:${("0" + allTime[3]).slice(-2)}`;
    else if (allTime[1] !== 0) res = `${("0" + allTime[1]).slice(-2)}:${("0" + allTime[2]).slice(-2)}:${("0" + allTime[3]).slice(-2)}`;
    else if (allTime[2] !== 0) res = `${("0" + allTime[2]).slice(-2)}:${("0" + allTime[3]).slice(-2)}`;
    else if (allTime[3] !== 0) res = `00:${("0" + allTime[3]).slice(-2)}`;
    return res;
}

async function sendMusicsInfo(bot, channel, sqlInfos) {
    if (!sqlInfos) {
        channel.send("Aucune musique n'est actuellement joué dans ce serveur Discord 😥").then(async (msg) => {
            await bot.basicFunctions.get("wait").run(10000);
            if (msg.deletable) msg.delete();
        });
    } else {
        const ytInfo = await ytdl.getInfo(sqlInfos.tagName);
        const startingDate = new Date(sqlInfos.startingDate);

        const URL = ytInfo.videoDetails.video_url;
        const avatarURL = await testChannelInfo(ytInfo.videoDetails.author.id) ? (await ytch.getChannelInfo(ytInfo.videoDetails.author.id)).authorThumbnails[2].url : null;

        const musicEmbed = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle(ytInfo.videoDetails.title)
            .setURL(URL)
            .setAuthor(ytInfo.videoDetails.author.name, avatarURL, ytInfo.videoDetails.author.channel_url)
            .setDescription('`')
            .setImage(ytInfo.videoDetails.thumbnails[2].url)
            .setTimestamp()
            .setFooter(bot.user.username, await bot.user.avatarURL());

        const duration = ytInfo.videoDetails.lengthSeconds;
        const timeProgression = Math.round((new Date() - startingDate) / 1000);
        const roundPlacementCal = Math.round(timeProgression / duration * 100 / 5) - 1;
        const roundPlacement = roundPlacementCal < 0 ? 0 : roundPlacementCal;

        for (let index = 0; index < 20; index++) {
            if (roundPlacement === index) musicEmbed.setDescription(musicEmbed.description + "🔘");
            else musicEmbed.setDescription(musicEmbed.description + "▬");
        }
        musicEmbed.setDescription(musicEmbed.description + "`\n");

        musicEmbed.setDescription(musicEmbed.description + `\`${await convertIntToStringTime(timeProgression)} / ${await convertIntToStringTime(duration)}\``);

        channel.send(musicEmbed).then(async (msg) => {
            await bot.basicFunctions.get("wait").run(20000);
            if (msg.deletable) msg.delete();
        });
    }
}

module.exports.addReaction = async (bot, reaction, user, messageData, index) => {
    reaction.users.remove(user.id);


    checkTheTypeOfTheGuild(bot, reaction.message.channel, async () => {
        const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
        bot.dataBase.get("connection").exec(bot.db, "SELECT * FROM ?? WHERE id = ?", [dbPrefix + "specialGuild", reaction.message.guild.id], async (error, results, fields) => {
            if (error) throw error;

            if (results[0].actualSongId === null) {
                sendMusicsInfo(bot, reaction.message.channel, null, null);
                return;
            }

            bot.dataBase.get("connection").exec(bot.db, "SELECT tagName, ? AS 'startingDate' FROM ?? WHERE id = ?", [results[0].startingDate, "musicsList", results[0].actualSongId], async (error, musicsResults, fields) => {
                if (error) throw error;

                if (musicsResults[0]) sendMusicsInfo(bot, reaction.message.channel, musicsResults[0]);
                else sendMusicsInfo(bot, reaction.message.channel, {
                    "id": -1,
                    "tagName": results[0].actualSongId,
                    "volume": 1
                });
            });
        });
    });
}

module.exports.removeReaction = async (bot, reaction, user, messageData, index) => {}

module.exports.help = {
    name: "index"
};