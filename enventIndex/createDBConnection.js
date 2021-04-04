module.exports.run = async (bot, callback) => {
    require("../../../dataBase/connection.js").getDb((db) => {
        bot.db = db;
        callback();
    });
};

module.exports.help = {
    name: "createDBConnection"
};