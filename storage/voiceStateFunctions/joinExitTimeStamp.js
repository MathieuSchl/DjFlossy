const Discord = require('discord.js');
const dataTrophy = require('../dataTrophy.json');


function meMeastiure(ms) {
    let d, h, m, s;
    s = ms / 1000;
    ms = ms % 1000;
    m = s / 60;
    s = s % 60;
    h = m / 60;
    m = m % 60;
    d = h / 24;
    h = h % 24;

    s = Math.trunc(s);
    m = Math.trunc(m);
    h = Math.trunc(h);
    d = Math.trunc(d);

    return [d, h, m, s, ms];
};

function updateTimeSpend(data, timeSpend) {
    if (!data.data.d) data.data.d = 0;
    if (!data.data.h) data.data.h = 0;
    if (!data.data.m) data.data.m = 0;
    if (!data.data.s) data.data.s = 0;
    const totalTime = timeSpend + (data.data.d * 24 * 60 * 60 * 1000) + (data.data.h * 60 * 60 * 1000) + (data.data.m * 60 * 1000) + (data.data.s * 1000);
    const time = meMeastiure(totalTime);
    data.data.d = time[0];
    data.data.h = time[1];
    data.data.m = time[2];
    data.data.s = time[3];
    return data;
}

async function sendNotification(bot, idUser, trophyName, trophyDescription) {
    const user = await bot.users.fetch(idUser);

    const trophyEmbed = new Discord.MessageEmbed()
        .setColor('#30F1AE')
        .setTitle('Nouveau trophée obtenu')
        .setDescription('Vous avez obtenu un nouveau trophée:\n' +
            "Trophée : `" + trophyName + "`\n" +
            "Descrition : `" + trophyDescription + "`")
        .setTimestamp();

    user.send(trophyEmbed);
}

function checkNewAcheivement(bot, data) {
    if (data.sevenDaysInARow == null) {
        const now = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);

        if (!data.data.previousDay) {
            data.data.previousDay = now.getTime();
            data.data.numberDaysInARow = 1;
        } else {
            now.setDate(now.getDate() - 1);
            if (now.getTime() > data.data.previousDay) {
                data.data.previousDay = now.getTime();
                data.data.numberDaysInARow = 1;
            } else if (now.getTime() === data.data.previousDay) {
                data.data.previousDay = now.getTime();
                data.data.numberDaysInARow++;
                if (data.data.numberDaysInARow >= 7) {
                    const title = dataTrophy.sevenDaysInARow["fr"].title;
                    const description = dataTrophy.sevenDaysInARow["fr"].description.replace('<BOTTAG>', bot.user.username);
                    sendNotification(bot, data.id, title, description);
                    data.sevenDaysInARow = bot.basicFunctions.get("getDateSqlFormat").run();
                    delete data.data.numberDaysInARow;
                    delete data.data.previousDay;
                }
            }
        }
    }

    //Acheivement 1 hour
    if ((!data.time_1H) && (data.data.h >= 1)) {
        const title = dataTrophy.time_1H["fr"].title.replace('<BOTTAG>', bot.user.username);
        const description = dataTrophy.time_1H["fr"].description.replace('<BOTTAG>', bot.user.username);
        sendNotification(bot, data.id, title, description);
        data.time_1H = bot.basicFunctions.get("getDateSqlFormat").run();
    }
    //Acheivement 1 day
    if ((!data.time_1D) && (data.data.d >= 1)) {
        const title = dataTrophy.time_1D["fr"].title;
        const description = dataTrophy.time_1D["fr"].description.replace('<BOTTAG>', bot.user.username);
        sendNotification(bot, data.id, title, description);
        data.time_1D = bot.basicFunctions.get("getDateSqlFormat").run();
    }
    return data;
}

function updateUserDataWhenDisconnect(bot, idUser, actualTime) {
    bot.basicFunctions.get("dbUserAchievements").select(bot, idUser, (error, results, fields) => {
        if (error) throw error;
        const result = results[0];
        if (!result.data.dateJoinVc) return;
        const startingTime = new Date(result.data.dateJoinVc);
        const data = updateTimeSpend(result, actualTime - startingTime);
        delete data.data.dateJoinVc;
        const dataAfterCheck = checkNewAcheivement(bot, data);
        bot.basicFunctions.get("dbUserAchievements").update(bot, dataAfterCheck, (error, results, fields) => {
            if (error) throw error;
        });
    });
}

function updateUserDataWhenJoin(bot, idUser, actualTime) {
    bot.basicFunctions.get("dbUserAchievements").select(bot, idUser, (error, results, fields) => {
        if (error) throw error;
        const result = results[0];
        result.data.dateJoinVc = actualTime;
        bot.basicFunctions.get("dbUserAchievements").update(bot, result, (error, results, fields) => {
            if (error) throw error;
        });
    });
}

module.exports.run = async (bot, oldState, newState, oldDatavoiceChannel, newDatavoiceChannel) => {
    //return if the bot is not connected to a channel and the voiceState is not for the bot
    if ((!oldState.guild.me.voice.channelID) && (bot.user.id !== oldState.member.user.id)) return;
    //return if the user is a bot, except if it is this client
    if (oldState.member.user.bot) {
        if (bot.user.id !== oldState.member.user.id) return;
    }
    const theAction = await bot.voiceStateFunctions.get("userVoiceUpdate").detectTheAction(oldState, newState);
    const actualTime = new Date();

    if ((bot.user.id === oldState.member.user.id) && (theAction === "join")) {
        const members = Array.from(newState.channel.members);
        for (let index = 0; index < members.length; index++) {
            const element = members[index];
            if (!element[1].user.bot) updateUserDataWhenJoin(bot, element[1].user.id, actualTime);
            await bot.basicFunctions.get("wait").run(100);
        }
    } else if ((bot.user.id === oldState.member.user.id) && (theAction === "disconect")) {
        const members = Array.from(oldState.channel.members);
        for (let index = 0; index < members.length; index++) {
            const element = members[index];
            if (!element[1].user.bot) updateUserDataWhenDisconnect(bot, element[1].user.id, actualTime);
            await bot.basicFunctions.get("wait").run(100);
        }
    } else if (theAction === "join") {
        const botIsPresent = (newState.channel.members.get(bot.user.id)) != null;
        if (botIsPresent) updateUserDataWhenJoin(bot, newState.member.user.id, actualTime);
    } else if (theAction === "disconect") {
        const botIsPresent = (oldState.channel.members.get(bot.user.id)) != null;
        if (botIsPresent) updateUserDataWhenDisconnect(bot, oldState.member.user.id, actualTime);
    } else if (theAction === "move") {
        const botIsPresentInOldChannel = (oldState.channel.members.get(bot.user.id)) != null;
        const botIsPresentInNewChannel = (newState.channel.members.get(bot.user.id)) != null;
        if (botIsPresentInOldChannel) {
            updateUserDataWhenDisconnect(bot, oldState.member.user.id, actualTime);
        } else if (botIsPresentInNewChannel) {
            updateUserDataWhenJoin(bot, newState.member.user.id, actualTime);
        } else {
            console.log("error user does not leave or join the voice channel");
        }
    }
};

module.exports.help = {
    name: "joinExitTimeStamp"
};