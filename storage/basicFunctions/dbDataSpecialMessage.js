const convertEmoji = require("../dataBase/convertEmoji.json");

function testIfIsEmojis(string) {
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    return (string.replace(regex, '') !== string);
}

module.exports.selectAll = async (bot, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ??', [dbPrefix + "specialMessage"], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            bot.dataBase.get("connection").createTable(dbPrefix, "specialMessage", () => {
                bot.basicFunctions.get("dbDataSpecialMessage").selectAll(bot, callback);
            });
            return;
        }
        for (let index = 0; index < results.length; index++) {
            const element = results[index];
            element.emoji = JSON.parse(element.emoji);
            for (let emojiIndex = 0; emojiIndex < element.emoji.length; emojiIndex++) {
                let theEmoji = element.emoji[emojiIndex];
                if (!testIfIsEmojis(theEmoji)) element.emoji[emojiIndex] = convertEmoji[theEmoji];
                if (!element.emoji[emojiIndex]) console.log("Emoji " + element.emoji[emojiIndex] + " is unknown");
            }
            element.type = JSON.parse(element.type);
            element.data = JSON.parse(element.data);
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.select = async (bot, idChannel, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ?? WHERE id = ?', [dbPrefix + "specialMessage", idChannel], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            bot.dataBase.get("connection").createTable(dbPrefix, "specialMessage", () => {
                bot.basicFunctions.get("dbDataSpecialMessage").select(bot, idChannel, callback);
            });
            return;
        }

        for (let index = 0; index < results.length; index++) {
            const element = results[index];
            element.emoji = JSON.parse(element.emoji);
            for (let emojiIndex = 0; emojiIndex < element.emoji.length; emojiIndex++) {
                let theEmoji = element.emoji[emojiIndex];
                if (!testIfIsEmojis(theEmoji)) element.emoji[emojiIndex] = convertEmoji[theEmoji];
                if (!element.emoji[emojiIndex]) console.log("Emoji " + element.emoji[emojiIndex] + " is unknown");
            }
            element.type = JSON.parse(element.type);
            element.data = JSON.parse(element.data);
        }
        if (callback) callback(error, results, fields);
        return;
    });
};

module.exports.update = async (bot, data, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, "UPDATE ?? SET `emoji` = ?, `type` = ?, `data` = ? WHERE `id` = ?", [dbPrefix + "specialMessage", JSON.stringify(data.emoji), JSON.stringify(data.type), JSON.stringify(data.data), data.id], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            bot.dataBase.get("connection").createTable(dbPrefix, "specialMessage", () => {
                bot.basicFunctions.get("dbDataSpecialMessage").update(bot, data, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.insert = async (bot, data, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, "INSERT INTO ?? (`id`, `channel`, `emoji`, `type`, `data`) VALUES (?, ?, ?, ?, ?)", [dbPrefix + "specialMessage", data.id, data.channel, JSON.stringify(data.emoji), JSON.stringify(data.type), JSON.stringify(data.data)], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            bot.dataBase.get("connection").createTable(dbPrefix, "specialMessage", () => {
                bot.basicFunctions.get("dbDataSpecialMessage").insert(bot, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.delete = async (bot, idChannel, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, "DELETE FROM ?? WHERE `id` = ?", [dbPrefix + "specialMessage", idChannel], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            bot.dataBase.get("connection").createTable(dbPrefix, "specialMessage", () => {
                bot.basicFunctions.get("dbDataSpecialMessage").delete(bot, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.help = {
    name: "dbDataSpecialMessage"
};