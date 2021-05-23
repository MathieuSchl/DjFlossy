const Discord = require("discord.js");
const emojiAvailable = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]


module.exports.run = async (bot, message, dataSpecialChannel) => {
    const channel = message.channel;
    bot.basicFunctions.get("deleteAll").run(bot, channel);


    //message 1: GUILDS
    const guilds = Array.from(bot.guilds.cache);
    emojiList = [];
    typeList = [];
    data = {};
    data.idGuildsList = [];

    const guildsEmbed = new Discord.MessageEmbed();
    guildsEmbed.setColor("#F51B1B");
    guildsEmbed.setTitle('Liste des serveurs')
    guildsEmbed.setDescription("Selectionnez un serveur:\n\n");

    for (let index = 0; index < guilds.length; index++) {
        const element = guilds[index][0];

        guildsEmbed.setDescription(guildsEmbed.description + emojiAvailable[emojiList.length] + " => " + guilds[index][1].name + "\n")

        emojiList.push(emojiAvailable[emojiList.length]);
        typeList.push("oneReactOnMess");
        data.idGuildsList.push(element);
    }

    channel.send(guildsEmbed).then(async (msg) => {
        for (let index = 0; index < emojiList.length; index++) {
            msg.react(emojiList[index]);
        }
        emojiList = await bot.basicFunctions.get("convertEmojiToString").run(emojiList);

        bot.basicFunctions.get("dbDataSpecialMessage").insert(bot, {
            "id": msg.id,
            "channel": channel.id,
            "emoji": emojiList,
            "type": typeList,
            "data": data
        }, async (error, results, fields) => {
            if (error) throw error;





            //message 2: ACTIONS
            emojiList = ["🎧", "👮", "🎙️", "🤖"];
            typeList = ["oneReactOnMess", "oneReactOnMess", "oneReactOnMess", "oneReactOnMess"];
            data = {};

            const actionEmbed = new Discord.MessageEmbed();
            actionEmbed.setColor("#FF9600");
            actionEmbed.setTitle('Liste des voiceType')
            actionEmbed.setDescription("Selectionnez un type:\n\n" +
                "🎧 => DJ\n" +
                "👮 => logsToTTS\n" +
                "🎙️ => TTS\n" +
                "🤖 => Chloé");

            channel.send(actionEmbed).then(async (msg) => {
                for (let index = 0; index < emojiList.length; index++) {
                    msg.react(emojiList[index]);
                }
                emojiList = await bot.basicFunctions.get("convertEmojiToString").run(emojiList);

                bot.basicFunctions.get("dbDataSpecialMessage").insert(bot, {
                    "id": msg.id,
                    "channel": channel.id,
                    "emoji": emojiList,
                    "type": typeList,
                    "data": data
                }, async (error, results, fields) => {
                    if (error) throw error;





                    //message 3: CONFIRMATION
                    emojiList = ["✅"];
                    typeList = ["confirmVCChange"];
                    data = {};
                    const actionEmbed = new Discord.MessageEmbed();
                    actionEmbed.setColor("#16E504");
                    actionEmbed.setTitle('Confirmation')
                    actionEmbed.setDescription("Cliquez sur ✅ pour confirmer votre changement");

                    channel.send(actionEmbed).then(async (msg) => {
                        for (let index = 0; index < emojiList.length; index++) {
                            msg.react(emojiList[index]);
                        }
                        emojiList = await bot.basicFunctions.get("convertEmojiToString").run(emojiList);

                        bot.basicFunctions.get("dbDataSpecialMessage").insert(bot, {
                            "id": msg.id,
                            "channel": channel.id,
                            "emoji": emojiList,
                            "type": typeList,
                            "data": data
                        }, async (error, results, fields) => {
                            if (error) throw error;
                        });
                    });
                })
            });
        })
    });
    return;
};

module.exports.help = {
    name: "reload"
};