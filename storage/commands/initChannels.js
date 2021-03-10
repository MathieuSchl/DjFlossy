async function init(bot, guild) {
    guild.channels.create(bot.user.username, {
        "type": "category"
    }).then(async (cat) => {
        guild.channels.create("pannel", {
            "type": "text",
            "parent": cat
        }).then(async (tc) => {
            guild.channels.create(bot.user.username, {
                "type": "voice",
                "parent": cat
            }).then(async (vc) => {
                const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
                bot.dataBase.get("connection").exec('INSERT INTO ?? (`id`, `type`, `data`) VALUES (?, ?, ?)', [dbPrefix + "specialTextChannel", tc.id, "songChannel", "{}"], (error, results, fields) => {
                    if (error) throw error;

                    const data = {
                        "musicChannel": tc.id,
                        "playListsBonus": []
                    };
                    bot.dataBase.get("connection").exec('UPDATE ?? SET `data` = ? WHERE `id` = ? ;', [dbPrefix + "specialGuild", JSON.stringify(data), guild.id], async (error, results, fields) => {
                        if (error) throw error;

                        await bot.basicFunctions.get("wait").run(250);
                        await bot.specialTextChannel["songChannel"].get("reload").reload(bot, tc);
                        await bot.basicFunctions.get("wait").run(1000);
                        bot.musicFunctions.get("createPlaylist").run(bot, guild.id, () => {
                            bot.musicFunctions.get("joinVoiceChannel").run(bot, vc.id);
                        });
                    });
                });
            })
        })
    })
}


module.exports.run = async (bot, message, dataSpecialChannel) => {
    init(bot, message.guild);
};


module.exports.help = {
    name: "initChannels"
};