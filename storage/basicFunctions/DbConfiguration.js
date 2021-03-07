const {
    table
} = require("console");
const fs = require("fs")

module.exports.getDbPrefix = async (bot) => {
    const config = require("../config.json");
    const prefix = config.dbPrefix;

    if (prefix == null) {
        config.dbPrefix = bot.user.username + "_";

        let donnees = JSON.stringify(config);
        fs.writeFileSync(config.location + "/storage/config.json", donnees);
        return config.dbPrefix;
    }
    return prefix;
};

function verifyATable(bot, dbPrefix, tableName) {
    bot.dataBase.get("connection").exec('SELECT * FROM ??', [dbPrefix + tableName], (error, results, fields) => {
        if (error) {
            if (error.code === "ER_NO_SUCH_TABLE") {
                bot.dataBase.get("connection").createTable(dbPrefix, tableName);
            }
            return;
        }
    });
    return;
}

module.exports.verifyTable = async (bot) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);

    verifyATable(bot, dbPrefix, "specialTextChannel");
    verifyATable(bot, dbPrefix, "specialGuild");
    verifyATable(bot, dbPrefix, "specialMessage");
    verifyATable(bot, dbPrefix, "specialVoiceChannel");

    return;
};


module.exports.help = {
    name: "DbConfiguration"
};


/*
    try{
        results.map(element => element.data = JSON.parse(element.data));
    }catch{}
*/