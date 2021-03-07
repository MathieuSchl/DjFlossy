module.exports.select = async (bot, idVoiceChannel, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec('SELECT * FROM ?? WHERE id = ?', [dbPrefix + "specialVoiceChannel", idVoiceChannel], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
};

module.exports.update = async (bot, data, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec("UPDATE ?? SET `type` = ?, `data` = ? WHERE `id` = ?", [dbPrefix + "specialVoiceChannel", data.type, JSON.stringify(data.data), data.id], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
};

module.exports.insert = async (bot, data, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec("INSERT INTO ?? (`id`, `type`, `data`) VALUES (?, ?, ?)", [dbPrefix + "specialVoiceChannel", data.id, data.type, JSON.stringify(data.data)], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
};

module.exports.delete = async (bot, idVoiceChannel, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec("DELETE FROM ?? WHERE `id` = ?", [dbPrefix + "specialVoiceChannel", idVoiceChannel], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
};

module.exports.help = {
    name: "dbDataSpecialVoiceChannel"
};