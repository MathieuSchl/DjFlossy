const name = __filename.split("\\")[__filename.split("\\").length - 1].split(".")[0];


module.exports.runCmd = async (bot, channel, member, args) => {
    channel.send("Menu help");
};

module.exports.data = {
    name: name,
    description: "Permet d'avoir de l'aide"
};

module.exports.help = {
    name: name,
    globalCommand: false
};