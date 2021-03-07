const Discord = require("discord.js");
const config = require('../storage/config.json');

module.exports.run = async (bot,message)=>{
    if(!message.guild){
        bot.enventIndex.get("messagesDM").run(bot, message);
        return;
    }

    if(message.author.id===bot.user.id) return;
    bot.enventIndex.get("testIfSpecialChannel").run(bot,message,(result)=>{
        if(result) return;

        var prefix = config.prefix;
        var messageArray = message.content.split(" ");
        if (messageArray[0]!==prefix) return ;
    
        try {
            if(messageArray[1]==="help") bot.commands.get(messageArray[1]).run(bot, message, messageArray,Array.from(bot.commands.keys()),bot.commands,prefix);
            else if(messageArray[1]==="man") bot.commands.get(messageArray[1]).run(bot, message, messageArray,Array.from(bot.commands.keys()),bot.commands);
            else if(messageArray.length>1) bot.commands.get(messageArray[1]).run(bot, message, messageArray);
        }
        catch(error) {
            console.log("Commande \""+messageArray[1]+"\" non reconnu")
        }
    })    
};


module.exports.help = {
    name: "messages"
};