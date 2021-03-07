const fs = require("fs");
const config = require("../config.json");

async function getEveryoneId(bot, guildId) {
    let roles = Array.from(await bot.guilds.cache.get(guildId).roles.cache);
    for (let i = 0; i < roles.length; i++) {
        if (roles[i][1].name === "@everyone") {
            return roles[i][1].id;
        }
    }
    return null;
}

module.exports.run = async (bot, message, dataSpecialChannel) => {
    if (!config.idBotAdmins.includes(message.author.id)) return;

    message.delete();

    if (config.idConsoleChannel != null) return;

    //Create category
    const guild = message.guild;
    let options = {
        "type": "category",
        permissionOverwrites: [{
            id: await getEveryoneId(bot, message.guild.id),
            deny: ['VIEW_CHANNEL'],
        }, ]
    }
    const category = await guild.channels.create(bot.user.username, options).then((channel) => {
        return channel;
    })

    //Create all channel needed
    options = {
        "type": "text",
        "parent": category.id
    }

    const dataCenterChannel = await guild.channels.create("dataCenter", options).then((channel) => {
        return channel;
    })

    const consoleChannel = await guild.channels.create("console", options).then((channel) => {
        return channel;
    })

    const dataCenterChannelData = {
        "id": dataCenterChannel.id,
        "type": "dataCenter",
        "data": {
            "pwd": "/"
        }
    };

    bot.basicFunctions.get("dbDataSpecialTextChannel").insert(bot, dataCenterChannelData, async (error, results, fields) => {
        if (error){
            console.log(fields);
            throw error;
        }

        await bot.basicFunctions.get("wait").run(1000);
        dataCenterChannel.send("Channel initialization").then((msg) => {
            bot.specialTextChannel.dataCenter.get("ls").run(bot, msg, dataCenterChannelData);
        })


        const consoleChannelData = {
            "id": consoleChannel.id,
            "type": "console",
            "data":{}
        };

        bot.basicFunctions.get("dbDataSpecialTextChannel").insert(bot, consoleChannelData, async (error, results, fields) => {
            if (error) throw error;

            //Update config
            config.idConsoleChannel = consoleChannel.id;

            donnees = JSON.stringify(config);
            fs.writeFileSync(config.location + "/storage/config.json", donnees);

            //Reboot
            console.log("Please restart the bot");
            await bot.basicFunctions.get("wait").run(1000);
            bot.specialTextChannel["console"].get("reloadConsole").run(bot);
            await bot.basicFunctions.get("wait").run(3000);
            bot.commands.get("destroy").run(bot, message, dataSpecialChannel)
        });
    });
};


module.exports.help = {
    name: "init"
};