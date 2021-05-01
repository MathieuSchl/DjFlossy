module.exports.run = async (bot, callback) => {
    require("../../../dataBase/connection.js").getDb((db) => {
        bot.db = db;
        callback();
    });
};

module.exports.reaload = async (bot, callback) => {
    const dbToClose = bot.db;
    require("../../../dataBase/connection.js").getDb(async (db) => {
        bot.db = db;
        callback();
        await bot.basicFunctions.get("wait").run(3000);
        dbToClose.end();
    });
};

module.exports.help = {
    name: "createDBConnection"
};