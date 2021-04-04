module.exports.run = async (bot, callback) => {
    bot.dataBase.get("connection").getDb((db) => {
        bot.db = db;
        callback();
    });
};

module.exports.help = {
    name: "createDBConnection"
};