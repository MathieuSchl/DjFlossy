const Discord = require('discord.js');


module.exports.run = async (bot, message, dataSpecialChannel) => {
    bot.dataBase.get("connection").exec(bot.db,"SELECT `name` FROM ??", ["musicTag"], async (error, results, fields) => {
        if (error) throw error;

        const playList = [];
        results.forEach(element => {
            playList.push(element.name);
        });

        const args = message.content.split(" ");
        for (let index = 0; index < args.length; index++) {
            const element = args[index];
            if (!playList.includes(element)) {
                message.channel.send("La playlist `" + element + "` n'existe pas").then(async (msg) => {
                    await bot.basicFunctions.get("wait").run(20000);
                    if (msg.deletable) msg.delete();
                });
                return;
            }
        }
        bot.dataBase.get("connection").exec(bot.db,"INSERT INTO ?? (`id`, `tagName`, `volume`) VALUES (NULL, ?, '1')", ["musicsList", dataSpecialChannel.data.musicTag], async (error, results, fields) => {
            if (error) throw error;

            bot.dataBase.get("connection").exec(bot.db,"SELECT `id` FROM ?? WHERE `tagName` = ?", ["musicsList", dataSpecialChannel.data.musicTag], async (error, results, fields) => {
                if (error) throw error;

                const id = results[0].id;
                for (let index = 0; index < args.length; index++) {
                    bot.dataBase.get("connection").exec(bot.db,"SELECT id FROM ?? WHERE `name` = ?", ["musicTag", args[index]], async (error, results, fields) => {
                        if (error) throw error;

                        const idTag = results[0].id;
                        bot.dataBase.get("connection").exec(bot.db,"INSERT INTO ?? (`id`, `idTag`, `idMusic`) VALUES (NULL, ?, ?)", ["musicsCorrelation", idTag, id], async (error, results, fields) => {
                            if (error) throw error;

                            const data = dataSpecialChannel.data;
                            data.status = "URL";
                            const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
                            bot.dataBase.get("connection").exec(bot.db,"UPDATE ?? SET `data` = ? WHERE `id` = ?", [dbPrefix + "specialTextChannel", JSON.stringify(data), dataSpecialChannel.id], async (error, results, fields) => {
                                if (error) throw error;

                                message.channel.messages.fetch().then(messages => {
                                    messages.array().forEach(msg => {
                                        if (msg.deletable) msg.delete();
                                    });
                                })

                                const exampleEmbed = new Discord.MessageEmbed()
                                    .setColor('#41FE38')
                                    .setTitle('Ajouter une nouvelle musique')
                                    .setDescription('Mettez dans le chat l\'URL youtube d\'une vidéo pour la rajouter');

                                message.channel.send(exampleEmbed);
                            });
                        });
                    });
                }
            });
        });
    });
}

module.exports.help = {
    name: "playList"
};