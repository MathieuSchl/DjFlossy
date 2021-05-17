const getName = () => {
    const path = __filename;
    const slashPath = path.split("/");
    const backSlashPath = path.split("\\");
    if (slashPath.length !== 1) {
        return slashPath[slashPath.length - 1].split(".")[0];
    }
    if (backSlashPath.length !== 1) {
        return backSlashPath[backSlashPath.length - 1].split(".")[0];
    } else {
        return null;
    }
}

const name = getName();
const Discord = require('discord.js');
const dataTrophy = require('../../dataTrophy.json');


function convertSqlDateToString(sqlDate) {
    const theDate = new Date(sqlDate);
    return ("0" + theDate.getDate()).slice(-2) + "/" + ("0" + (theDate.getMonth() + 1)).slice(-2) + "/" + theDate.getFullYear();
}

async function addOneAchievement(bot, channel, member, embed, dataAchievement, achievementsName, countChar, usersCount, callback) {
    if (achievementsName.length === 0) {
        callback(embed);
        return;
    }
    if (countChar > 1900) {
        member.send(embed);
        const color = embed.color;
        embed = new Discord.MessageEmbed()
            .setColor(color)
        countChar = 0;
    }

    const achievementName = achievementsName[0];
    achievementsName.splice(0, 1);
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT COUNT(??) FROM ??', [achievementName, dbPrefix + "achievements"], (error, results, fields) => {
        if (error) throw error;

        const count = results[0][Object.keys(results[0])[0]];
        const title = dataTrophy[achievementName]["fr"].title.replace('<BOTTAG>', bot.user.username);
        countChar += title.length;
        const obtainingTime = dataAchievement[achievementName] ? convertSqlDateToString(dataAchievement[achievementName]) : "Non obtenu";
        const achievementPercent = (count / usersCount) * 100;
        const description = dataTrophy[achievementName]["fr"].description.replace('<BOTTAG>', bot.user.username) + "\n" +
            "Trophé obtenu le `" + obtainingTime + "`\n" +
            "Rareté : `" + achievementPercent + "%`\n" +
            "Obtenu : `" + count + "`";
        countChar += description.length;
        embed.addField(title, description, true);
        addOneAchievement(bot, channel, member, embed, dataAchievement, achievementsName, countChar, usersCount, callback);
        return;
    });
}

module.exports.runCmd = async (bot, channel, member, args) => {
    bot.basicFunctions.get("dbUserAchievements").select(bot, member.user.id, async (error, results, fields) => {
        if (error) throw error;
        const result = results[0];
        const achievementsName = Object.keys(result);
        achievementsName.splice(0, 2);
        let countChar = 0;
        let helpEmbed = new Discord.MessageEmbed()
            .setColor('#F9F51F')
        const title = "Liste de trophé de " + member.user.username;
        countChar += title.length;
        helpEmbed.setTitle(title);
        const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
        bot.dataBase.get("connection").exec(bot.db, 'SELECT COUNT(*) FROM ??', [dbPrefix + "achievements"], (error, results, fields) => {
            if (error) throw error;
            const usersCount = results[0]["COUNT(*)"];
            addOneAchievement(bot, channel, member, helpEmbed, result, achievementsName, countChar, usersCount, (lastEmbed) => {
                lastEmbed.setTimestamp()
                member.send(lastEmbed);
            });
            return;
        });
        return;
    });
};

module.exports.data = {
    name: name,
    description: "Get the list of my achievement"
};

module.exports.help = {
    name: name,
    globalCommand: true
};