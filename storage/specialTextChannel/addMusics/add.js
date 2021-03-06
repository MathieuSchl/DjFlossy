const Discord = require('discord.js');
const ytdl = require('ytdl-core');


function next(bot, message, dataSpecialChannel, musicTag) {
    if (musicTag == null) {
        message.channel.send("L'URL de la vidéo n'est pas correct").then(async (msg) => {
            await bot.basicFunctions.get("wait").run(20000);
            if (msg.deletable) msg.delete();
        });
        return;
    }
    bot.dataBase.get("connection").exec(bot.db, "SELECT * FROM ?? WHERE tagName = ?", ["musicsList", musicTag], async (error, results, fields) => {
        if (error) throw error;

        if ((musicTag.length === 11) && results.length !== 0) {
            message.channel.send("Cette musique existe déjà").then(async (msg) => {
                await bot.basicFunctions.get("wait").run(20000);
                if (msg.deletable) msg.delete();
            });
            return;
        }

        const data = dataSpecialChannel.data;
        data.status = "playList";
        data.musicTag = musicTag;
        const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
        bot.dataBase.get("connection").exec(bot.db, "UPDATE ?? SET `data` = ? WHERE `id` = ?", [dbPrefix + "specialTextChannel", JSON.stringify(data), dataSpecialChannel.id], async (error, results, fields) => {

            bot.dataBase.get("connection").exec(bot.db, "SELECT `name` FROM ??", ["musicTag"], async (error, results, fields) => {
                if (error) throw error;

                message.channel.messages.fetch().then(messages => {
                    messages.array().forEach(msg => {
                        if (msg.deletable) msg.delete();
                    });
                })

                const playlistEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Sélectionnez les playlists')
                    .setDescription('Ecrivez dans le chat les playlists à ajouter pour la musique https://www.youtube.com/watch?v=' + data.musicTag + "\n" +
                        "Playlists disponble:\n");

                for (let index = 0; index < results.length; index++) {
                    const element = results[index].name;
                    playlistEmbed.setDescription(playlistEmbed.description + "- `" + element + "`\n");
                }

                playlistEmbed.setDescription(playlistEmbed.description + "\nMerci de séparer les playlists par des espaces");

                message.channel.send(playlistEmbed);
            });
        });
    });
}

module.exports.run = async (bot, message, dataSpecialChannel) => {
    const args = message.content.split(" ");
    if (args.length === 0) {
        message.channel.send("Merci de mettre l'url d'une musique youtube").then(async (msg) => {
            await bot.basicFunctions.get("wait").run(20000);
            if (msg.deletable) msg.delete();
        });
        return;
    }
    let musicTag = (ytdl.validateID(args[0])) || (ytdl.validateURL(args[0])) ? (await ytdl.getInfo(args[0])).videoDetails.videoId : null;
    if (musicTag == null) musicTag = bot.basicFunctions.get("getVideosFromYtPlaylist").validateURL(args[0], (playlistId) => {
        next(bot, message, dataSpecialChannel, playlistId);
    })
    else {
        next(bot, message, dataSpecialChannel, musicTag);
    }
}

module.exports.help = {
    name: "add"
};