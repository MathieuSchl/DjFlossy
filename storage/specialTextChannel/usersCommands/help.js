const Discord = require("discord.js");


module.exports.run = async (bot, message, dataSpecialChannel) => {
    var helpEmbed = new Discord.MessageEmbed();
    helpEmbed.setColor("#B154BE");
    helpEmbed.setTitle('Liste des commandes')
    helpEmbed.setDescription('Les commandes pour le bot doivent commencer par `$`')
    helpEmbed.addFields({
        name: '$ping',
        value: 'Le bot dois répondre `pong` à cette command. Cela permet de vérifier que le bot est connecté'
    })
    message.channel.send(helpEmbed);
};

module.exports.help = {
    name: "help"
};