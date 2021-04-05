const Discord = require("discord.js");
const convertEmoji = require("../../../../../dataBase/convertEmoji.json");


function testIfIsEmojis(string) {
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    return (string.replace(regex, '') !== string);
}

async function realoadChannel(bot, channel) {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT data FROM ?? WHERE id = ?', [dbPrefix + "specialGuild", channel.guild.id], (error, results, fields) => {
        if (error) throw error;

        let query = 'SELECT name,emoji FROM ?? WHERE `enable` = ?';
        const playListsBonus = JSON.parse(results[0].data).playListsBonus ? JSON.parse(results[0].data).playListsBonus : [];
        for (let index = 0; index < playListsBonus.length; index++) {
            const element = playListsBonus[index];
            query = query + " OR `id`='" + element + "'";
        }

        bot.dataBase.get("connection").exec(bot.db, query, ["musicTag", 1], (error, results, fields) => {
            if (error) throw error;

            const playList = [];
            for (let index = 0; index < results.length; index++) {
                results[index].emoji;
                if (!testIfIsEmojis(results[index].emoji)) results[index].emoji = convertEmoji[results[index].emoji];
                playList.push(results[index]);
            }

            for (let index = 0; index < results.length; index++) {

            }

            //delete all message in the channel
            channel.messages.fetch().then(messages => {
                messages.array().forEach(msg => {
                    if (msg.deletable) msg.delete();
                    bot.dataBase.get("connection").exec(bot.db, 'DELETE FROM ?? WHERE id = ?', [dbPrefix + "specialMessage", msg.id], (error, results, fields) => {
                        if (error) throw error;
                    });
                });
            })

            var songsEmbed = new Discord.MessageEmbed();
            songsEmbed.setColor("#FFB100");
            songsEmbed.setTitle('Liste des playlists');
            songsEmbed.setDescription('Sélectionnez vos playlists en cliquant sur les reactions\nLe bot <@' + bot.user.id + '> jouera ensuite les musiques des playlists sélectionné dans le channel vocal où il est:\n\n');
            for (let index = 0; index < playList.length; index++) {
                const element = playList[index];
                songsEmbed.setDescription(songsEmbed.description + element.emoji + " => " + element.name + "\n");
            }
            let emojiList = [];
            let typeList = [];
            channel.send(songsEmbed).then(async (msg) => {
                for (let index = 0; index < playList.length; index++) {
                    msg.react(playList[index].emoji);
                    emojiList.push(playList[index].emoji);
                    typeList.push("configPlaylist");
                }
                emojiList = await bot.basicFunctions.get("convertEmojiToString").run(emojiList);

                bot.basicFunctions.get("dbDataSpecialMessage").insert(bot, {
                    "id": msg.id,
                    "channel": channel.id,
                    "emoji": emojiList,
                    "type": typeList,
                    "data": {}
                }, async (error, results, fields) => {
                    if (error) throw error;

                    emojiList = ["🔽", "⏭️", "❓"];
                    typeList = ["onMe", "next", "np"];
                    var commandsEmbed = new Discord.MessageEmbed();
                    commandsEmbed.setColor("#001EFF");
                    commandsEmbed.setTitle('Liste des commandes')
                    commandsEmbed.setDescription("Cliquez sur les réactions pour faire l'action correspondante:\n\n" +
                        "🔽 => Permets de déplacer le bot dans le salon vocal actuel\n" +
                        "⏭️ => Permets de passer à la musique suivante\n"+
                        "❓  => Donne les informations de la musique en cour")
                    channel.send(commandsEmbed).then(async (msg) => {
                        for (let index = 0; index < emojiList.length; index++) {
                            msg.react(emojiList[index]);
                        }
                        emojiList = await bot.basicFunctions.get("convertEmojiToString").run(emojiList);

                        bot.basicFunctions.get("dbDataSpecialMessage").insert(bot, {
                            "id": msg.id,
                            "channel": channel.id,
                            "emoji": emojiList,
                            "type": typeList,
                            "data": {}
                        }, async (error, results, fields) => {
                            if (error) throw error;
                        })
                    });
                    return;
                })
            });
        });
    });
}

module.exports.run = async (bot, message, dataSpecialChannel) => {
    realoadChannel(bot, message.channel);
};

module.exports.reload = async (bot, channel) => {
    realoadChannel(bot, channel);
};

module.exports.help = {
    name: "reload"
};