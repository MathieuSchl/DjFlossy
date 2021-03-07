const Discord = require("discord.js");
const config = require('../../config.json');
const fs = require("fs");
const pathToAdd = config.location + "storage/data/";


module.exports.run = async (bot, message, dataSpecialChannel)=>{
    let pwd = dataSpecialChannel.data.pwd;


    if (pwd===""){
        console.log("error with channel `"+message.channel.name+"` pwd not found")
        return ;
    }

    let realpwd = pathToAdd + pwd;

    var messageToSend = "```Path :\n"+pwd+"\n\n";
    fs.readdir(realpwd, (err, theFolder) =>{
        var folders = [];
        var files = [];
        if (theFolder==null){
            message.channel.bulkDelete(20);
            bot.basicFunctions.get("deleteAll").run(bot,message.channel);
            message.channel.send("Il y a une erreur avec le chemin d'accès sauvegardé.\n Utilisez la command reset pour le réinitialiser.");
            return;
        }
        for (var i = 0; i < theFolder.length; i++) {
            if(theFolder[i].split(".").length===1){
                folders.push(theFolder[i]);
            }else{
                files.push(theFolder[i]);
            }
        }

        messageToSend = messageToSend+"Folder :\n";
        for (var i = 0; i < folders.length; i++) {
            messageToSend = messageToSend+folders[i];
            for (var j = 0; j < 30-folders[i].length; j++) {
                messageToSend = messageToSend+" ";
            }
        }


        messageToSend = messageToSend+"\n\nFiles :\n";
        for (var i = 0; i < files.length; i++) {
            messageToSend = messageToSend+files[i];
            for (var j = 0; j < 30 - files[i].length; j++) {
                messageToSend = messageToSend+" ";
            }
        }

        messageToSend = messageToSend+"```";

        async function go(message,messageToSend){
            message.channel.bulkDelete(20);
            bot.basicFunctions.get("deleteAll").run(bot,message.channel);
            message.channel.send(messageToSend);
        }
        go(message,messageToSend);
    });
};

module.exports.help = {
    name: "ls"
};