const config = require('../../config.json');

module.exports.run = async (bot, message, dataSpecialChannel) => {
    message.delete();
    const args = message.content.split(" ");

    const currentGuildId = message.guild.id;
    let canModifyRole = false;
    let existingRole = false;

    if (message.member.hasPermission("ADMINISTRATOR")) {
        if(args.length<2){
            message.channel.send("Merci de renseigner un role de cette manière:  addRole @[roleName]").then(msg => {msg.delete({ timeout: 5000 })});
            return;
        }
        canModifyRole = true;
        let manageTheRole = Array.from(bot.guilds.cache.get(currentGuildId).roles.cache);
        existingRole = false;
        let argument2= args[1];
        argument2=argument2.substr(3,argument2.length);
        argument2=argument2.substr(0,argument2.length - 1);
        for (let numIdRole of manageTheRole){
            if (numIdRole[1].id === argument2){
                existingRole=true;
                for (let numRoles of dataSpecialChannel["data"]["textChannelAdmin"]){    
                    if(numIdRole[1].id===numRoles){
                        message.channel.send("Erreur. Ce rôle est déjà ajouté, si vous voulez le suprimer utilisez la commande suivante :  rmRole @[roleName]").then(msg => {msg.delete({ timeout: 5000 })});
                        return
                    }
                }
                dataSpecialChannel["data"]["textChannelAdmin"].push(numIdRole[1].id);

                bot.basicFunctions.get("dbDataSpecialTextChannel").update(bot, dataSpecialChannel, (error, results, fields) => {
                    if (error) throw error;
                });
                message.channel.send("Ajout de "+args[1]+" terminé").then(msg => {msg.delete({ timeout: 5000 })});
            }
        }
    }
    if (canModifyRole === false) {
        message.channel.send("Vous ne pouvez pas modifier la liste des rôles").then(msg => {
            msg.delete({
                timeout: 5000
            })
        });
    }
    if (existingRole === false) {
        message.channel.send("Erreur. Veuillez écrire la commande sous la forme addRole @[roleName]").then(msg => {
            msg.delete({
                timeout: 5000
            })
        });
        return
    }
}

module.exports.help = {
    name: "addRole"
};