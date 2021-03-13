module.exports.run = async (bot, guild) => {
    bot.basicFunctions.get("dbDataSpecialGuild").insert(bot, {
        "id": guild.id,
        "actionAdd": [],
        "actionRemove": [],
        "data": {
            "musicChannel": null,
            "pannel": null,
            "playListsBonus": []
        }
    }, (error, results, fields) => {
        if (error) throw error;

        bot.commands.get("initChannels").newGuild(bot, guild, (vc, tc) => {
            bot.basicFunctions.get("dbDataSpecialGuild").update(bot, {
                "id": guild.id,
                "actionAdd": [],
                "actionRemove": [],
                "data": {
                    "musicChannel": vc,
                    "pannel": tc,
                    "playListsBonus": []
                }
            }, (error, results, fields) => {
                if (error) throw error;
            });
        })
    });
};


module.exports.help = {
    name: "botJoinAGuild"
};