const Discord = require("discord.js");
var CronJob = require('cron').CronJob;


async function startCron(bot, data) {
    const user = await bot.users.fetch(data.user);

    const job = new CronJob(data.cronSchedule, async function () {
        user.send(data.data.mess);

        if (!data.repetitive) {
            job.stop();
            const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
            bot.dataBase.get("connection").exec(bot.db, 'DELETE FROM ?? WHERE `id` = ?', [dbPrefix + "cronTables", data.id], async (error, results, fields) => {
                for (let index = 0; index < results.length; index++) {
                    results[index].data = JSON.parse(results[index].data);

                    const theCron = results[index];

                    const res = await startCron(bot, theCron);
                    bot.cronTab.set(res.name, res.job);
                    bot.cronTab.get(res.name).start();
                }
                return;
            });
        }
    });

    return {
        "name": data.type + ">" + user.username,
        "job": job
    };
}


async function startMPCron(bot) {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ?? WHERE `type` = "MP"', [dbPrefix + "cronTables"], async (error, results, fields) => {
        for (let index = 0; index < results.length; index++) {
            results[index].data = JSON.parse(results[index].data);

            const theCron = results[index];

            const res = await startCron(bot, theCron);
            bot.cronTab.set(res.name, res.job);
            bot.cronTab.get(res.name).start();
        }
        return;
    });
}

module.exports.run = async (bot) => {
    let listCron = Array.from(bot.cronTable);
    if (listCron.length !== 0) bot["cronTab"] = new Discord.Collection();

    for (let cron of listCron) {
        const res = await cron[1].run(bot);
        bot.cronTab.set(res.name, res.job);
        bot.cronTab.get(res.name).start();
    }

    startMPCron(bot);
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