module.exports.select = async (bot, idUser, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ?? WHERE id = ?', [dbPrefix + "achievements", idUser], (error, results, fields) => {
        if (!error && results.length === 0) {
            bot.basicFunctions.get("dbUserAchevements").insert(bot, idUser, (error, results, fields) => {
                if (error) throw error;
                bot.basicFunctions.get("dbUserAchevements").select(bot, idUser, callback);
            });
        } else {
            for (let index = 0; index < results.length; index++) {
                results[index].data = JSON.parse(results[index].data);
            }
            callback(error, results, fields);
            return;
        }
    });
};

module.exports.update = async (bot, data, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, "UPDATE ?? SET `data` = ?, `easterEgg_Chloe` = ?, `secretPlaylist_1` = ?, `time_1H` = ?, `time_1D` = ? WHERE `id` = ?", [dbPrefix + "achievements", JSON.stringify(data.data), data.easterEgg_Chloe, data.secretPlaylist_1, data.time_1H, data.time_1D, data.id], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
};

module.exports.insert = async (bot, idUser, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, "INSERT INTO ?? (`id`) VALUES (?)", [dbPrefix + "achievements", idUser], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
};

module.exports.delete = async (bot, idUser, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, "DELETE FROM ?? WHERE `id` = ?", [dbPrefix + "achievements", idUser], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
};

module.exports.help = {
    name: "dbUserAchevements"
};