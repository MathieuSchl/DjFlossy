const Discord = require("discord.js");

module.exports.run = async(bot, message, dataSpecialChannel)=> {
    message.delete();

    let currentGuildId=message.guild.id;

    if (dataSpecialChannel["data"]["textChannelAdmin"].length===0){
        const roleEmbed = new Discord.MessageEmbed()
            .setColor('#FF8905')
            .setTitle("Roles autorisés pour l'API des Mini-Prusa")
            .setDescription("Personne ne peux utiliser l'API\nPour ajouter des rôles, utilisez la commande addRole @[roleName]")
        message.channel.send(roleEmbed).then(msg => {msg.delete({ timeout: 10000 })});
        return
    }

    let roleList = dataSpecialChannel["data"]["textChannelAdmin"];

    let role = await bot.guilds.cache.get(currentGuildId).roles.cache;
    role = Array.from(role);

    let roleId = [];

    for (let i = role.length; i > 0; i--) {
        for (let j = 0; j < role.length; j++) {
            let roleGuild = role[j][1];
            if (i === roleGuild.rawPosition) {
                for (let element of roleList){
                    if (roleGuild.id===element){
                        roleId.push(roleGuild);
                    }
                }
            }
        }
    }
    const roleEmbed = new Discord.MessageEmbed()
        .setColor('#FF8905')
        .setTitle("Rôles autorisés pour l'API des Mini-Prusa")
        .setDescription('')

    for(let element of roleId){
        roleEmbed.setDescription(roleEmbed.description+"<@&"+element+">\n")
    }

    message.channel.send(roleEmbed).then(msg => {msg.delete({ timeout: 15000 })});
};

module.exports.help = {
    name: "listRole"
};