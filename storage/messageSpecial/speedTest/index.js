const Discord = require("discord.js");


module.exports.addReaction = async (bot, reaction, user, messageData, index) => {
    reaction.users.remove(user.id);

    const channel = reaction.message.channel;
    const speedEmbed = new Discord.MessageEmbed();
    speedEmbed.setColor("#FF0000");
    speedEmbed.setTitle('SpeedTest')
    speedEmbed.setDescription("Test en cours")

    channel.send(speedEmbed).then(async (msg) => {
        await require("../../../../../dataBase/SpeedTest.js").fullTests(async (res) => {
            speedEmbed.setColor("#37FF00");
            speedEmbed.setDescription("");
            speedEmbed.addFields({
                name: 'DataDase',
                value: "DB connection : " + res[0] + "\n" +
                    "DB query : " + res[1]
            }, {
                name: 'Discord',
                value: "Discord connection : " + res[2] + "\n" +
                    "Discord action : " + res[3]
            });
            speedEmbed.setTimestamp();

            msg.edit(speedEmbed).then(async (msg) => {
                await bot.basicFunctions.get("wait").run(20000);
                if (msg.deletable) msg.delete()
            })
        });
    })




    /*    
    require("./enventIndex/createDBConnection").run(bot, async () => {
    });
    */
}

module.exports.removeReaction = async (bot, reaction, user, messageData, index) => {}

module.exports.help = {
    name: "index"
};