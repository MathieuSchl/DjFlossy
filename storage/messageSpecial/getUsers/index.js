module.exports.addReaction = async (bot, reaction, user, messageData, index) => {
    reaction.users.remove(user.id);

    bot.basicFunctions.get("dbUserAchievements").selectAll(bot, async (error, results, fields) => {
        if (error) throw error;

        const channel = reaction.message.channel;
        let msg = "";
        for (let index = 0; index < results.length; index++) {
            const userData = results[index];
            const user = await bot.users.fetch(userData.id);
            let username = user.tag;
            for (let index = user.username.length; index <= 32; index++) {
                username = username + " ";
            }
            username = username + "|";

            const element = username + userData.data.d + " jours " + userData.data.h + "h " + userData.data.m + "m " + userData.data.s + "s";
            if (msg.length + element.length <= 1900) {
                msg = msg + element + "\n";
            } else {
                channel.send("```\n" + msg + "```");
                msg = element + "\n";
            }
        }
        channel.send("```\n" + msg + "```");

        await bot.basicFunctions.get("wait").run(30000);
        bot.specialTextChannel.dataCenter.get("reload").run(bot, reaction.message, null);
    });
}

module.exports.removeReaction = async (bot, reaction, user, messageData, index) => {}

module.exports.help = {
    name: "index"
};