const Discord = require("discord.js");
const config = require('../../config.json');
const fs = require("fs");
const pathToAdd = config.location + "storage/data/documentsChannel/";


module.exports.run = async (bot, message, dataSpecialChannel) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
        message.channel.send("Tu n'es pas autorisé à faire ca !").then(async (msg) => {
            await bot.basicFunctions.get("wait").run(10000);
            if (!msg.deleted) msg.delete();
        })
        return;
    }
    const embed = await bot.specialTextChannel.embedChannel.get("reload").getEmbed(dataSpecialChannel);
    message.channel.messages.fetch().then(messages => {
        messages.array().reverse().forEach(msg => {
            if (!msg.deleted) msg.delete();
        });

    });
    message.channel.send(embed);

    const folder = message.channel.id;
    const pwd = pathToAdd + folder + "/";

    fs.readdir(pwd, async (err, filesSansFiltre) => {
        const docsEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle("Documents disponible")
            .setDescription('Pour télécharger un document écrivez le nom du document dans le chat:\n');

        for (let i = 0; i < filesSansFiltre.length; i++) {
            docsEmbed.setDescription(docsEmbed.description + "- `" + filesSansFiltre[i] + "`\n");
        }
        message.channel.send(docsEmbed);
    });
};

module.exports.help = {
    name: "reload"
};