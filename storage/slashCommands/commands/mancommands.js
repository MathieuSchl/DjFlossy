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


module.exports.runCmd = async (bot, channel, member, args) => {
    bot.basicFunctions.get("dbDataSpecialGuild").select(bot, channel.guild ? channel.guild.id : null, (error, results, fields) => {
        if (error) throw error;
        const commandChannel = results[0] ? results[0].data ? results[0].data.pannel : null : null;
        const channelString = commandChannel ? (await bot.channel.fetch(commandChannel)).name : " de commande";
        const helpEmbed = new Discord.MessageEmbed()
            .setColor('#37FF00')
            .setTitle(bot.user.username + ' menu d\'aide');

        helpEmbed.addField("Configuration des playlists", "Pour activer une playlist, il suffit de cliquer sur l'emoji de la playlist à ajouter.\n" +
                "-Une playlist est désactivé s'il y a 1 réaction\n" +
                "-Une playlist est activé s'il y a 2 réactions\n" +
                "-Si y a 3 réactions les réactions vont être suprimé pour qu'il y en ai plus qu'une seule")

            .addField("🔽 onme", "La commande `onme` permet de déplacer le bot dans le salon vocal où vous vous trouvez.", true)
            .addField("⏭️ next", "La commande `next` permet de passer la musique actuelle à la musique suivante.", true)
            .addField("❓ now playing", "La commande `now playing` permet d'avoir les informations sur la musique actuelle'.", true)
            .addField("custom music", "Pour utiliser des musiques personnalisé, vous pouvez mettre un lien youtube dans le channel " + channelString + ".", true)
            .addField("secret playlist", "Il existe des playlists secrètes (les trouver donne des trophés). Pour cela, vous pouvez mettre le nom de la playlist dans le channel " + channelString + ".", true)

        bot.slashCommands.get("sendMessage").run(bot, helpEmbed, channel, member);
    });
};

module.exports.data = {
    name: name,
    description: "Explains how commands works"
};

module.exports.help = {
    name: name,
    globalCommand: true
};