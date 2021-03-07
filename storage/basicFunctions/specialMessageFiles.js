const config = require('../config.json');
const fs = require("fs");
const Discord = require("discord.js");
const path = config.location + "/storage/data/specialMessageList/";


module.exports.createAddRoleFile = async (bot, message, emojis, roles) => {
    for (let index = 0; index < emojis.length; index++) {
        const element = emojis[index];
        message.react(element)
    }

    let messageData = await bot.basicFunctions.get("specialMessageFiles").open(message.id);

    if (!messageData) {
        messageData = {
            "id": message.id,
            "channel": message.channel.id,
            "emoji": [],
            "type": [],
            "data": {
                "title": "New embed",
                "color": "",
                "URL": "",
                "author": "",
                "description": "A new embed is created",
                "thumbnail": "",
                "fields": "",
                "image": "",
                "timestamp": false,
                "footer": ""
            }
        }
    }

    for (let index = 0; index < emojis.length; index++) {
        const length = messageData.emoji.length;

        messageData.emoji.splice(length, 0, emojis[index]);
        messageData.type.splice(length, 0, "addRole");
        messageData.data[length.toString()] = roles[index];
    }

    await bot.basicFunctions.get("specialMessageFiles").write(message.id, messageData);

    return;
};

module.exports.createAddRoleEmbed = async (bot, channel) => {
    const theEmbed = new Discord.MessageEmbed();
    theEmbed.setTitle("New embed");
    theEmbed.setDescription("A new embed is created");
    channel.send(theEmbed).then((msg)=>{
        bot.basicFunctions.get("specialMessageFiles").createAddRoleFile(bot, msg, [], []);
        return;
    });
}

module.exports.open = async (messageId) => {
    try {
        file = fs.readFileSync(config.location + "/storage/data/specialMessageList/" + messageId + ".json");
        let dataSpecialMessage = JSON.parse(file);
        return dataSpecialMessage;
    } catch (e) {
        return false;
    }
};

module.exports.write = async (messageId, dataSpecialMessage) => {
    try {
        let data = JSON.stringify(dataSpecialMessage);
        fs.writeFileSync(path + messageId + ".json", data);
        return;
    } catch (e) {
        return;
    }
};

module.exports.help = {
    name: "specialMessageFiles"
};