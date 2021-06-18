module.exports.selectAll = async (bot, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ??', [dbPrefix + "specialVoiceChannel"], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            bot.dataBase.get("connection").createTable(dbPrefix, "specialVoiceChannel", () => {
                bot.basicFunctions.get("dbDataSpecialVoiceChannel").selectAll(bot, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.select = async (bot, idVoiceChannel, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ?? WHERE id = ?', [dbPrefix + "specialVoiceChannel", idVoiceChannel], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            bot.dataBase.get("connection").createTable(dbPrefix, "specialVoiceChannel", () => {
                bot.basicFunctions.get("dbDataSpecialVoiceChannel").select(bot, idVoiceChannel, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.update = async (bot, data, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, "UPDATE ?? SET `type` = ?, `data` = ? WHERE `id` = ?", [dbPrefix + "specialVoiceChannel", data.type, JSON.stringify(data.data), data.id], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            bot.dataBase.get("connection").createTable(dbPrefix, "specialVoiceChannel", () => {
                bot.basicFunctions.get("dbDataSpecialVoiceChannel").update(bot, data, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.insert = async (bot, data, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, "INSERT INTO ?? (`id`, `type`, `data`) VALUES (?, ?, ?)", [dbPrefix + "specialVoiceChannel", data.id, data.type, JSON.stringify(data.data)], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            bot.dataBase.get("connection").createTable(dbPrefix, "specialVoiceChannel", () => {
                bot.basicFunctions.get("dbDataSpecialVoiceChannel").insert(bot, data, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.delete = async (bot, idVoiceChannel, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, "DELETE FROM ?? WHERE `id` = ?", [dbPrefix + "specialVoiceChannel", idVoiceChannel], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            bot.dataBase.get("connection").createTable(dbPrefix, "specialVoiceChannel", () => {
                bot.basicFunctions.get("dbDataSpecialVoiceChannel").delete(bot, idVoiceChannel, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.help = {
    name: "dbDataSpecialVoiceChannel"
};