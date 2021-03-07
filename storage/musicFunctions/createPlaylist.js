const titleList = ["Liste des playlists"];


function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

async function getQuerryForSelectSong(bot, idGuild, callback) {
    //callback(error, results, fields);
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec('SELECT id FROM ?? WHERE `type` = "songChannel"', [dbPrefix + "specialTextChannel"], async (error, results, fields) => {
        if (error) throw error;

        const listPlaylistId = [];
        for (let index = 0; index < results.length; index++) {
            const channel = await bot.channels.fetch(results[0].id)
            if (channel.guild.id === idGuild) {
                await channel.messages.fetch().then((messages) => {
                    messages.forEach(msg => {
                        if (msg.embeds[0] != null) {
                            if (titleList.includes(msg.embeds[0].title)) {
                                const reactions = Array.from(msg.reactions.cache);
                                reactions.forEach(async (reaction) => {
                                    if (reaction[1].count > 1) {
                                        const emojiList = await bot.basicFunctions.get("convertEmojiToString").run([reaction[0]]);
                                        bot.dataBase.get("connection").exec('SELECT id FROM ?? WHERE emoji = ?', ["musicTag", emojiList[0]], async (error, results, fields) => {
                                            if (error) {
                                                console.log(error);
                                            } else {
                                                listPlaylistId.push(results[0].id);
                                            }
                                        });
                                    }
                                })
                            }
                        }
                    });
                })
            }
        }
        await bot.basicFunctions.get("wait").run(1000);
        let query = "SELECT idMusic FROM ??"
        if (listPlaylistId.length !== 0) {
            query = query + " WHERE"
            for (let index = 0; index < listPlaylistId.length; index++) {
                const element = listPlaylistId[index];
                if (index === 0) query = query + " `idTag` = " + element;
                else query = query + " OR `idTag` = " + element;
            }
        } else {
            query = query + " WHERE `idTag` = 1";
        }
        bot.dataBase.get("connection").exec(query, ["musicsCorrelation"], async (error, results, fields) => {
            if (error) throw error;

            query = "SELECT id FROM ??"
            if (results.length !== 0) {
                query = query + " WHERE"
                for (let index = 0; index < results.length; index++) {
                    const element = results[index];
                    if (index === 0) query = query + " `id` = " + element.idMusic;
                    else query = query + " OR `id` = " + element.idMusic;
                }
            }
            callback(query);
        });
    });
}

async function getMusicsForPlaylist(bot, idGuild, callback) {
    await getQuerryForSelectSong(bot, idGuild, (query) => {
        bot.dataBase.get("connection").exec(query, ["musicsList"], async (error, results, fields) => {
            callback(error, results, fields);
        });
    });
}


module.exports.run = async (bot, idGuild, callback) => {
    getMusicsForPlaylist(bot, idGuild, async (error, results, fields) => {
        if (error) throw error;

        results = shuffle(results);
        const music = [];
        for (let index = 0; index < results.length && index < 50; index++) {
            music.push(results[index].id);
        }

        const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
        bot.dataBase.get("connection").exec('SELECT `songsList` FROM ?? WHERE `id` = ?', [dbPrefix + "specialGuild", idGuild], (error, results, fields) => {
            if (error) throw error;

            let data = results[0];
            data = JSON.parse(data.songsList);
            data = music;
            data = JSON.stringify(data);

            bot.dataBase.get("connection").exec('UPDATE ?? SET `songsList` = ? WHERE `id` = ?;', [dbPrefix + "specialGuild", data, idGuild], (error, results, fields) => {
                if (error) throw error;

                callback(error, results, fields);
                return;
            });
            return;
        });
        return;
    });
}

module.exports.help = {
    name: "createPlaylist"
};