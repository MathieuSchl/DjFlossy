

module.exports.run = async (bot, message, dataSpecialChannel) => {
    message.channel.send("pong");
    return;
}

module.exports.help = {
    name: "ping"
};