const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (bot, message, channel) => {
    if (message) {
        channel = message.channel;
        if (message.deletable) message.delete();
    }
    channel.send("pong")
        .then(msg => {
            msg.delete({
                timeout: 10000
            })
        });
};


module.exports.help = {
    name: "ping"
};