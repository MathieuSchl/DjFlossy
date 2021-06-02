module.exports.select = async (bot, idGuild, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ?? WHERE id = ?', [dbPrefix + "specialGuild", idGuild], (error, results, fields) => {
        for (let index = 0; index < results.length; index++) {
            results[index].actionAdd = JSON.parse(results[index].actionAdd);
            results[index].actionRemove = JSON.parse(results[index].actionRemove);
            results[index].slashCommands = JSON.parse(results[index].slashCommands);
            results[index].data = JSON.parse(results[index].data);
        }

        callback(error, results, fields);
        return;
    });
};

module.exports.selectAll = async (bot, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ??', [dbPrefix + "specialGuild"], (error, results, fields) => {
        for (let index = 0; index < results.length; index++) {
            results[index].actionAdd = JSON.parse(results[index].actionAdd);
            results[index].actionRemove = JSON.parse(results[index].actionRemove);
            results[index].slashCommands = JSON.parse(results[index].slashCommands);
            results[index].data = JSON.parse(results[index].data);
        }

        callback(error, results, fields);
        return;
    });
};

module.exports.update = async (bot, data, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, "UPDATE ?? SET `actionAdd` = ?, `actionRemove` = ?, `actualSongId` = ?, `songsList` = ?, `data` = ? WHERE `id` = ?", [dbPrefix + "specialGuild", JSON.stringify(data.actionAdd), JSON.stringify(data.actionRemove), data.actualSongId, data.songsList, JSON.stringify(data.data), data.id], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
};

module.exports.insert = async (bot, data, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, "INSERT INTO ?? (`id`, `actionAdd`, `actionRemove`, `data`) VALUES (?, ?, ?, ?)", [dbPrefix + "specialGuild", data.id, JSON.stringify(data.actionAdd), JSON.stringify(data.actionRemove), JSON.stringify(data.slashCommands), JSON.stringify(data.data)], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
};

module.exports.delete = async (bot, idGuild, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, "DELETE FROM ?? WHERE `id` = ?", [dbPrefix + "specialGuild", idGuild], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
};

module.exports.help = {
    name: "dbDataSpecialGuild"
};