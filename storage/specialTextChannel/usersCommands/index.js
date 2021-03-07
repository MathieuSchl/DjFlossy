const prefix = "$"

async function changeCharFromSting(index, char, sting) {
    return sting.substr(0, index) + char + sting.substr(index + char.length);
}

module.exports.run = async (bot, message, dataSpecialChannel) => {
    if (message.content[0] !== prefix) {
        return;
    }
    try {
        let command = message.content.split(" ")[0].substr(1);
        bot.specialTextChannel.usersCommands.get(command).run(bot, message, dataSpecialChannel);
    } catch (e) {
        //console.log(e);
        //console.log("connais pas")
    }
}

module.exports.help = {
    name: "index"
};