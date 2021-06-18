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

module.exports.selectAll = async (bot, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ??', [dbPrefix + "specialTextChannel"], async (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            bot.dataBase.get("connection").createTable(dbPrefix, "specialTextChannel", () => {
                bot.basicFunctions.get("dbDataSpecialTextChannel").selectAll(bot, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.select = async (bot, idChannel, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ?? WHERE id = ?', [dbPrefix + "specialTextChannel", idChannel], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            bot.dataBase.get("connection").createTable(dbPrefix, "specialTextChannel", () => {
                bot.basicFunctions.get("dbDataSpecialTextChannel").select(bot, idChannel, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.update = async (bot, data, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, "UPDATE ?? SET `type` = ?, `data` = ? WHERE `id` = ?", [dbPrefix + "specialTextChannel", data.type, JSON.stringify(data.data), data.id], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            bot.dataBase.get("connection").createTable(dbPrefix, "specialTextChannel", () => {
                bot.basicFunctions.get("dbDataSpecialTextChannel").update(bot, data, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.insert = async (bot, data, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, "INSERT INTO ?? (`id`, `type`, `data`) VALUES (?, ?, ?)", [dbPrefix + "specialTextChannel", data.id, data.type, JSON.stringify(data.data)], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            bot.dataBase.get("connection").createTable(dbPrefix, "specialTextChannel", () => {
                bot.basicFunctions.get("dbDataSpecialTextChannel").insert(bot, data, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.delete = async (bot, idChannel, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, "DELETE FROM ?? WHERE `id` = ?", [dbPrefix + "specialTextChannel", idChannel], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            bot.dataBase.get("connection").createTable(dbPrefix, "specialTextChannel", () => {
                bot.basicFunctions.get("dbDataSpecialTextChannel").delete(bot, idChannel, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.help = {
    name: "dbDataSpecialTextChannel"
};