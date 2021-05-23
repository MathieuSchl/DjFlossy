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
    let query = "UPDATE ?? SET `data` = ?";
    const options = [dbPrefix + "achievements", JSON.stringify(data.data)];
    const id = data.id;
    delete data.data;
    delete data.id;

    const keys = Object.keys(data);
    for (let index = 0; index < keys.length; index++) {
        const element = keys[index];
        const value = data[element];
        query=query+", `"+element+"` = ?";
        options.push(value);
    }

    query = query + " WHERE `id` = ?";
    options.push(id);
    bot.dataBase.get("connection").exec(bot.db, query, options, (error, results, fields) => {
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
    name: "dbUserAchievements"
};