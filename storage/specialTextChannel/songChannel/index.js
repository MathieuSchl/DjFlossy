const fs = require('fs');
const pathSlashCommand = require("../../config.json").location + "/storage/specialTextChannel/songChannel/secretPlaylist/";
const system = "songChannel"

async function changeCharFromSting(index, char, sting) {
    return sting.substr(0, index) + char + sting.substr(index + char.length);
}

module.exports.run = async (bot, message, dataSpecialChannel) => {
    try {
        let command = message.content.split(" ")[0];
        bot.specialTextChannel[system].get(command).run(bot, message, dataSpecialChannel);
    } catch (e) {
        //console.log(e);
        fs.readdir(pathSlashCommand, (err, files) => {
            if (err) throw err;

            const lowCommand = message.content.split(" ")[0].toLowerCase();
            for (let index = 0; index < files.length; index++) {
                const element = require(pathSlashCommand + files[index]);
                if (element.help.acceptedWord.includes(lowCommand)) {
                    element.run(bot, message, dataSpecialChannel);
                    return;
                }
            }
            bot.specialTextChannel[system].get("customSong").run(bot, message, dataSpecialChannel);
        })
    }
}

module.exports.help = {
    name: "index"
};