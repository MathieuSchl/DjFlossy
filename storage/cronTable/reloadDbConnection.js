var CronJob = require('cron').CronJob;
const name = "reloadDbConnection"; //Set name here


module.exports.run = async (bot) => {

    //modify tour cron here
    const job = new CronJob('0 */30 * * * *', async function () {
        bot.enventIndex.get("createDBConnection").reaload(bot, () => {});
    });

    //Stop


    return {
        "name": name,
        "job": job
    };
};


module.exports.help = {
    name: name
};