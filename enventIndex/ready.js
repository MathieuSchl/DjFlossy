const config = require("../storage/config.json");

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports.run = async (bot) => {
    console.log(" ");
    console.log("Logged in as : " + bot.user.tag);
    console.log(" ");

    try {
        bot.basicFunctions.get("activity").run(bot);

        bot.enventIndex.get("cronTab").run(bot);
        await bot.enventIndex.get("catchMessageInSpecialChannels").run(bot);

        bot.specialTextChannel["console"].get("reloadConsole").run(bot);

        await bot.basicFunctions.get("DbConfiguration").verifyTable(bot);

        bot.musicFunctions.get("startBotMusicInGuilds").run(bot);
    } catch (e) {
        const disk = config.location.split("")[0];
        if (["C", "D", "E"].includes(disk)) {
            console.log("Error in ready.js")
            console.log(e)
            bot.commands.get("destroy").run(bot, null, null);
            require('../storage/commands/destroy.js').run(bot, null, null);
        } else {
            await wait(10000);
            require("./cronTab.js").stop(bot);
            bot.destroy();
            await wait(5000);
            require("../storage/specialTextChannel/dataCenter/reboot.js").run(bot, null, null);
        }
    }
};


module.exports.help = {
    name: "ready"
};