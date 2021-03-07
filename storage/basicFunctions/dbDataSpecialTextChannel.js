const config = require('../config.json');
const fs = require("fs");
const path = config.location + "/storage/data/specialChannelList/";

module.exports.open = async (idChannel) => {
    try {
        fichiers = fs.readFileSync(path + idChannel + ".json");
        let dataSpecialChannel = JSON.parse(fichiers);

        return dataSpecialChannel;
    } catch (e) {
        return null;
    }
};

module.exports.write = async (idChannel, data) => {
    try {
        let donnees = JSON.stringify(data);
        fs.writeFileSync(path + idChannel + ".json", donnees);
        return;
    } catch (e) {
        return;
    }
};

module.exports.select = async (bot, idChannel, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec('SELECT * FROM ?? WHERE id = ?', [dbPrefix + "specialTextChannel", idChannel], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
};

module.exports.update = async (bot, data, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec("UPDATE ?? SET `type` = ?, `data` = ? WHERE `id` = ?", [dbPrefix + "specialTextChannel", data.type, JSON.stringify(data.data), data.id], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
};

module.exports.insert = async (bot, data, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec("INSERT INTO ?? (`id`, `type`, `data`) VALUES (?, ?, ?)", [dbPrefix + "specialTextChannel", data.id, data.type, JSON.stringify(data.data)], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
};

module.exports.delete = async (bot, idChannel, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec("DELETE FROM ?? WHERE `id` = ?", [dbPrefix + "specialTextChannel", idChannel], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
};

module.exports.help = {
    name: "dbDataSpecialTextChannel"
};