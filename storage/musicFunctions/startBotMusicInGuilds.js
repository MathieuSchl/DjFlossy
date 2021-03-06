async function resetAllPlaylist(bot, callback) {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'UPDATE ?? SET `actualSongId` = NULL , `songsList` = \'[]\'', [dbPrefix + "specialGuild"], (error, results, fields) => {

        callback(error, results, fields);
        return;
    });
}

async function getAllGuilds(bot, callback) {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ??', [dbPrefix + "specialGuild"], (error, results, fields) => {
        for (let index = 0; index < results.length; index++) {
            results[index].actionAdd = JSON.parse(results[index].actionAdd);
            results[index].actionRemove = JSON.parse(results[index].actionRemove);
            results[index].songsList = JSON.parse(results[index].songsList);
            results[index].data = JSON.parse(results[index].data);
        }

        callback(error, results, fields);
        return;
    });
}

async function joinVC(bot, voiceChannel) {
    voiceChannel.join().then((connection) => {
        connection.on("disconnect", () => {
            if (connection.dispatcher) connection.dispatcher.destroy();
        })
    }).catch(async (err) => {
        console.log("Error in startBotMusicInGuilds")
        if (err.code === "VOICE_CONNECTION_TIMEOUT") {
            console.log(new Date());
            console.log("VOICE_CONNECTION_TIMEOUT " + voiceChannel.guild.name + "\n");
            voiceChannel.leave();
            await bot.basicFunctions.get("wait").run(3000);
            joinVC(bot, voiceChannel);
        } else {
            console.log(err);
        }
    });
}

module.exports.run = async (bot) => {
    resetAllPlaylist(bot, (error, results, fields) => {
        if (error) throw error;

        getAllGuilds(bot, async (error, results, fields) => {
            if (error) throw error;

            for (let index = 0; index < results.length; index++) {
                const element = results[index];


                const voiceChannel = await bot.channels.fetch(element.data.musicChannel);
                if (voiceChannel.type !== "voice") {
                    const guild = voiceChannel.guild;
                    const owner = await guild.members.fetch(guild.ownerID);
                    owner.send(`I can't join the channel \`${voiceChannel.name}\` in the guild\`${guild}\`\n` +
                        `The channel is not a \`voice channel\``);
                    return;
                };

                joinVC(bot, voiceChannel);
                await bot.basicFunctions.get("wait").run(500);
            }
        });
    })
}

module.exports.one = async (bot, guildId, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'UPDATE ?? SET `actualSongId` = NULL , `songsList` = \'[]\' WHERE `id` = ?', [dbPrefix + "specialGuild", guildId], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
}

module.exports.help = {
    name: "startBotMusicInGuilds"
};