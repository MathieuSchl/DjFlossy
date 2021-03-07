const Discord = require("discord.js");


module.exports.run = async (bot) => {
    let listCron = Array.from(bot.cronTable);
    if (listCron.length !== 0) bot["cronTab"] = new Discord.Collection();

    for (let cron of listCron) {
        const res = await cron[1].run(bot);
        bot.cronTab.set(res.name, res.job);
        bot.cronTab.get(res.name).start();
    }
};

module.exports.stop = async (bot) => {
    try {
        let listCron = Array.from(bot.cronTable);

        for (let cron of listCron) {
            bot.cronTab.get(cron[0]).stop();
        }
    } catch {}
};


module.exports.help = {
    name: "cronTab"
};