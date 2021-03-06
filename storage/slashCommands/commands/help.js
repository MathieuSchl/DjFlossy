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
        const helpEmbed = new Discord.MessageEmbed()
            .setColor('#37FF00')
            .setTitle(bot.user.username + ' menu d\'aide');
        if (commandChannel) {
            helpEmbed.setDescription('DjFlossy est un bot de musique. Lorsqu\'un utilisateur rejoint <@' + bot.user.id + "> dans un salon vocal, le bot va automatiquement lancer de la musique celon les playlists paramétré.\n\n" +
                    "Dans le channel <#" + commandChannel + ">, vous pouvez paramétrer les playlists jouées et accèder à des commandes.")
                .addField("Configuration des playlists", "Pour activer une playlist, il suffit de cliquer sur l'emoji de la playlist à ajouter.\n" +
                    "-Une playlist est désactivé s'il y a 1 réaction\n" +
                    "-Une playlist est activé s'il y a 2 réactions\n" +
                    "-Si y a 3 réactions les réactions vont être suprimé pour qu'il y en ai plus qu'une seule");
            helpEmbed.addField("Autres commandes", "D'autres commandes sont disponibles pour le bot. Pour utiliser ces commandes, il suffit de cliquer sur l'emoji de la commande à utiliser");
        } else {
            if (member.guild) helpEmbed.setDescription("Le channel de commandes de DjFlossy sur ce serveur n'est pas parramètré");
            else {
                helpEmbed.setDescription('DjFlossy est un bot de musique. Lorsqu\'un utilisateur rejoint <@' + bot.user.id + "> dans un salon vocal, le bot va automatiquement lancer de la musique celon les playlists paramétré.\n\n" +
                        "Sur un serveur où ce bot est présent, vous trouverez un channel où vous pouvez paramétrer les playlists jouées et accèder à des commandes.")
                    .addField("Configuration des playlists", "Pour activer une playlist, il suffit de cliquer sur l'emoji de la playlist à ajouter.\n" +
                        "-Une playlist est désactivé s'il y a 1 réaction\n" +
                        "-Une playlist est activé s'il y a 2 réactions\n" +
                        "-Si y a 3 réactions les réactions vont être suprimé pour qu'il y en ai plus qu'une seule");
                        helpEmbed.addField("Autres commandes", "D'autres commandes sont disponibles pour le bot. Pour utiliser ces commandes, il suffit de cliquer sur l'emoji de la commande à utiliser");
                        helpEmbed.addField("Plus de Détails", "Pour plus de détails sur les commandes utilisez la commande `/mancommands`");
            }
        }

        bot.slashCommands.get("sendMessage").run(bot, helpEmbed, channel, member);
    });
};

module.exports.data = {
    name: name,
    description: "Explains how the bot works"
};

module.exports.help = {
    name: name,
    globalCommand: true
};