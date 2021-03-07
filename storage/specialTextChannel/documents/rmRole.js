const fs = require('fs');
const config = require('../../config.json');

module.exports.run = async (bot, message, dataSpecialChannel) => {
    message.delete();
    const args = message.content.split(" ");

    let currentGuildId = message.guild.id;
    let canModifyRole = false;
    let existingRole = false;
    let isInFile = false;
    let numiterRole = 0;



    if (message.member.hasPermission("ADMINISTRATOR")) {
        if(args.length<2){
            message.channel.send("Merci de renseigner un role de cette manière:  rmRole @[roleName]").then(msg => {msg.delete({ timeout: 5000 })});
            return;
        }
        canModifyRole = true;
        let manageTheRole = Array.from(bot.guilds.cache.get(currentGuildId).roles.cache);
        existingRole = false;
        let argument2 = args[1];
        argument2 = argument2.substr(3, argument2.length);
        argument2 = argument2.substr(0, argument2.length - 1);

        for (let numIdRole of manageTheRole) {
            if (numIdRole[1].id === argument2) {
                existingRole = true;
                numiterRole = 0;
                isInFile = false;
                for (let numRoles of dataSpecialChannel["data"]["textChannelAdmin"]) {
                    if (numIdRole[1].id === numRoles) {
                        isInFile = true;
                        message.channel.send("Suppression du rôle " + args[1] + " terminée").then(msg => {
                            msg.delete({
                                timeout: 5000
                            })
                        });
                        dataSpecialChannel["data"]["textChannelAdmin"].splice(numiterRole);
                        bot.basicFunctions.get("dbDataSpecialTextChannel").update(bot, dataSpecialChannel, (error, results, fields) => {
                            if (error) throw error;
                        });
                    }
                    numiterRole += 1;
                }
            }
        }
    }
    if (existingRole === false) {
        message.channel.send("Erreur. Veuillez écrire la commande sous la forme rmRole @[roleName]").then(msg => {
            msg.delete({
                timeout: 5000
            })
        });
        return
    }
    if (isInFile === false) {
        message.channel.send("Impossible de supprimer un rôle qui n'est pas ajouté.\nPour l'ajouter utilisez la commande addRole @[roleName]").then(msg => {
            msg.delete({
                timeout: 5000
            })
        });
        return
    }
    if (canModifyRole === false) {
        message.channel.send("Vous ne pouvez pas modifier la liste de rôle").then(msg => {
            msg.delete({
                timeout: 5000
            })
        });
        return
    }
};

module.exports.help = {
    name: "rmRole"
};