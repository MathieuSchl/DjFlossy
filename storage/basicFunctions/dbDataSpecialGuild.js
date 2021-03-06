module.exports.select = async (bot, idGuild, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ?? WHERE id = ?', [dbPrefix + "specialGuild", idGuild], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            bot.dataBase.get("connection").createTable(dbPrefix, "specialGuild", () => {
                bot.basicFunctions.get("dbDataSpecialGuild").select(bot, callback);
            });
            return;
        }
        try {
            for (let index = 0; index < results.length; index++) {
                results[index].actionAdd = JSON.parse(results[index].actionAdd);
                results[index].actionRemove = JSON.parse(results[index].actionRemove);
                results[index].slashCommands = JSON.parse(results[index].slashCommands);
                results[index].data = JSON.parse(results[index].data);
            }
        } catch {}

        callback(error, results, fields);
        return;
    });
};

module.exports.selectAll = async (bot, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ??', [dbPrefix + "specialGuild"], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            bot.dataBase.get("connection").createTable(dbPrefix, "specialGuild", () => {
                bot.basicFunctions.get("dbDataSpecialGuild").selectAll(bot, callback);
            });
            return;
        }
        try {
            for (let index = 0; index < results.length; index++) {
                results[index].actionAdd = JSON.parse(results[index].actionAdd);
                results[index].actionRemove = JSON.parse(results[index].actionRemove);
                results[index].slashCommands = JSON.parse(results[index].slashCommands);
                results[index].data = JSON.parse(results[index].data);
            }
        } catch {}

        callback(error, results, fields);
        return;
    });
};

module.exports.update = async (bot, data, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, "UPDATE ?? SET `actionAdd` = ?, `actionRemove` = ?, `slashCommands` = ? , `songsList` = ? , `data` = ? WHERE `id` = ?", [dbPrefix + "specialGuild", JSON.stringify(data.actionAdd), JSON.stringify(data.actionRemove), JSON.stringify(data.slashCommands), JSON.stringify(data.songsList), JSON.stringify(data.data), data.id], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            bot.dataBase.get("connection").createTable(dbPrefix, "specialGuild", () => {
                bot.basicFunctions.get("dbDataSpecialGuild").update(bot, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.insert = async (bot, data, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, "INSERT INTO ?? (`id`, `actionAdd`, `actionRemove`, `slashCommands`, `data`) VALUES (?, ?, ?, ?, ?)", [dbPrefix + "specialGuild", data.id, JSON.stringify(data.actionAdd), JSON.stringify(data.actionRemove), JSON.stringify(data.slashCommands), JSON.stringify(data.data)], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            bot.dataBase.get("connection").createTable(dbPrefix, "specialGuild", () => {
                bot.basicFunctions.get("dbDataSpecialGuild").insert(bot, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.delete = async (bot, idGuild, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, "DELETE FROM ?? WHERE `id` = ?", [dbPrefix + "specialGuild", idGuild], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            bot.dataBase.get("connection").createTable(dbPrefix, "specialGuild", () => {
                bot.basicFunctions.get("dbDataSpecialGuild").delete(bot, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.help = {
    name: "dbDataSpecialGuild"
};