const config = require("../../config.json");
const path = config.location + "";
const system = "git";


module.exports.run = async (bot, message, dataSpecialChannel) => {
    bot.specialTextChannel[system].get("pull").run(bot, message, dataSpecialChannel);
}

module.exports.help = {
    name: "index"
};