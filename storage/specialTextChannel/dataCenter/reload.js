const Discord = require("discord.js");


module.exports.run = async (bot, message, dataSpecialChannel) => {
    const channel = message.channel;
    bot.basicFunctions.get("deleteAll").run(bot, channel);

    emojiList = ["👋", "ℹ️", "💣", "🎵", "❓"];
    typeList = ["ping", "speedTest", "destroy", "reloadAllSongsChannels", "getUsers"];
    const commandsEmbed = new Discord.MessageEmbed();
    commandsEmbed.setColor("#FF9600");
    commandsEmbed.setTitle('Liste des commandes')
    commandsEmbed.setDescription("Cliquez sur les réactions pour faire l'action correspondante:\n\n" +
        "👋 => Permets de ping le bot\n" +
        "ℹ️ => Permets de faire un test de vitesse\n" +
        "💣 => Permets d'éteindre le bot\n" +
        "🎵 => Permets de reload tous les `songsChannel`\n" +
        "❓ => Permets de voir les utilisateurs qui utilise <@" + bot.user + ">")
    channel.send(commandsEmbed).then(async (msg) => {
        for (let index = 0; index < emojiList.length; index++) {
            msg.react(emojiList[index]);
        }
        emojiList = await bot.basicFunctions.get("convertEmojiToString").run(emojiList);

        bot.basicFunctions.get("dbDataSpecialMessage").insert(bot, {
            "id": msg.id,
            "channel": channel.id,
            "emoji": emojiList,
            "type": typeList,
            "data": {}
        }, async (error, results, fields) => {
            if (error) throw error;
        })
    });
};

module.exports.help = {
    name: "reload"
};