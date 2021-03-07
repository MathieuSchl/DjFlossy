const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (bot, message, dataSpecialChannel)=>{
    message.delete();
    message.channel.send("pong")
        .then(msg => {
            msg.delete({ timeout: 10000 })
        });
};


module.exports.help = {
    name: "ping"
};