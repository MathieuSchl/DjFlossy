module.exports.run = async (bot, message, dataSpecialChannel) => {
    if (message.deletable) message.delete();
};

module.exports.help = {
    name: "delete"
};