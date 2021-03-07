const config = require("../../config.json");
const path = config.location+"";
const system = "console";


module.exports.run = async (bot, message, dataSpecialChannel) => {
    bot.specialTextChannel[system].get("reloadConsole").run(bot);
}

module.exports.help = {
    name: "index"
};