const fs = require("fs");
const config = require('../../config.json');
const pathToAdd = config.location + "storage/data/documentsChannel/";

module.exports.run = async (bot, message, dataSpecialChannel) => {
    if (!message.deleted) message.delete();

    const args = message.content.split(" ");
    const folder = message.channel.id;
    const pwd = pathToAdd + folder + "/";

    var files = [];
    var noFiles = [];
    for (var i = 0; i < args.length; i++) {
        try {
            if (fs.existsSync(pwd + args[i])) {
                files.push(pwd + args[i])
            } else {
                noFiles.push(args[i])
            }
        } catch (err) {
            console.log(err)
        }
    }

    var messToSend = "";
    if (noFiles.length !== 0) {
        if (noFiles.length === 1) {
            messToSend = "Le fichier `" + noFiles[0] + "` n'est pas un fichier valide";
            message.channel.send(messToSend).then(async (msg) => {
                await bot.basicFunctions.get("wait").run(20000);
                if (!msg.deleted) msg.delete();
            });
            return;
        }
        messToSend = "Les fichiers ";
        for (var i = 0; i < noFiles.length; i++) {
            if (i !== 0) {
                messToSend = messToSend + ", `" + noFiles[i] + "`";
            } else {
                messToSend = messToSend + "`" + noFiles[i] + "`";
            }
        }
        messToSend = messToSend + " ne sont pas des fichiers valides";
        if (files.length === 0) {
            message.channel.send(messToSend).then(async (msg) => {
                await bot.basicFunctions.get("wait").run(20000);
                if (!msg.deleted) msg.delete();
            });
            return;
        }
        messToSend = messToSend + "\n";
    }

    if (files.length === 1) {
        let file = files[0].split("/")[files[0].split("/").length - 1]
        messToSend = messToSend + "Le fichier \"" + file + "\" à été téléchargé";
    } else {
        messToSend = messToSend + "Les fichiers ";
        for (var i = 0; i < files.length; i++) {
            let file = files[i].split("/")[files[i].split("/").length - 1]
            if (i !== 0) {
                messToSend = messToSend + ", \"" + pwd + file + "\"";
            } else {
                messToSend = messToSend + "\"" + pwd + file + "\"";
            }
        }
    }
    message.channel.send(messToSend, {
        files: files
    }).then(async (msg) => {
        await bot.basicFunctions.get("wait").run(30000);
        if (!msg.deleted) msg.delete();
    });
};

module.exports.help = {
    name: "dlFile"
};