const Discord = require("discord.js");
var CronJob = require('cron').CronJob;


async function deleteCronInDb(bot, id) {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'DELETE FROM ?? WHERE `id` = ?', [dbPrefix + "cronTables", id], async (error, results, fields) => {
        if (error) throw error;
        return;
    });
}

async function startCron(bot, data) {
    const user = await bot.users.fetch(data.user);

    try {
        const cronElements = data.cronSchedule.split(" ");

        const nowDate = new Date();
        const cronDate = new Date();
        cronDate.setMilliseconds(0);
        if (cronElements[0] !== "*") cronDate.setUTCSeconds(cronElements[0]);
        if (cronElements[1] !== "*") cronDate.setUTCMinutes(cronElements[1]);
        if (cronElements[2] !== "*") cronDate.setUTCHours(cronElements[2]);
        if (cronElements[3] !== "*") cronDate.setUTCDate(cronElements[3]);
        if (cronElements[4] !== "*") cronDate.setUTCMonth(cronElements[4]);
        if (cronElements[5] !== "*") {
            if (cronElements[5] < cronDate.getDay()) {
                cronDate.setUTCDate(cronDate.getUTCDate() + (7 - cronDate.getDay()));
            }
            cronDate.setUTCDate(cronDate.getUTCDate() + parseInt(cronElements[5]));
        }

        if ((data.data.year) && (data.data.year != nowDate.getFullYear())) return;

        if ((cronElements[0] !== "*") && (cronElements[1] !== "*") && (cronElements[2] !== "*") && (cronElements[3] !== "*") && (cronElements[4] !== "*")) {
            if ((data.repetitive) && (nowDate > cronDate)) {
                deleteCronInDb(bot, data.id);
                return;
            }
        }

        nowDate.setUTCDate(nowDate.getUTCDate() + 2);
        if (nowDate < cronDate) return;
    } catch (e) {
        //console.log(e);
    }

    const job = new CronJob(data.cronSchedule, async function () {
        user.send(data.data.mess);

        const nowDate = new Date();
        const logsEmbed = new Discord.MessageEmbed()
            .setColor('#FF9504')
            .setTitle('Cron envoyé')
            .setDescription("Cron envoyé à `" + user.username + "` à `" + `${nowDate.getDate()}/${nowDate.getMonth()}/${nowDate.getFullYear()} ${nowDate.getHours()}:${nowDate.getMinutes()}` + "`\n" +
                "Message : `" + data.data.mess + "`");
        member.user.send(logsEmbed);

        if (!data.repetitive) {
            job.stop();
            deleteCronInDb(bot, data.id);
        }
    });

    return {
        "name": data.type + ">" + user.username + "_" + data.id,
        "job": job
    };
}

async function startMPCron(bot) {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ?? WHERE `type` = "MP"', [dbPrefix + "cronTables"], async (error, results, fields) => {
        if (error) throw error;
        for (let index = 0; index < results.length; index++) {
            results[index].data = JSON.parse(results[index].data);

            const theCron = results[index];

            const res = await startCron(bot, theCron);
            if (res) {
                bot.cronTab.set(res.name, res.job);
                bot.cronTab.get(res.name).start();
            }
        }
        return;
    });
}

module.exports.run = async (bot) => {
    let listCron = Array.from(bot.cronTable);
    if (listCron.length !== 0) bot["cronTab"] = new Discord.Collection();

    for (let cron of listCron) {
        const res = await cron[1].run(bot);
        if (res) {
            bot.cronTab.set(res.name, res.job);
            bot.cronTab.get(res.name).start();
        }
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

module.exports.start = async (bot, data) => {
    return await startCron(bot, data);
};


module.exports.help = {
    name: "cronTab"
};