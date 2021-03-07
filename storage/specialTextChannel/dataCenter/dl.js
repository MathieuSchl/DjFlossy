const config = require('../../config.json');
const fs = require("fs");
const pathToAdd = config.location + "storage/data/"


async function dlAll(bot, message, pwd, dataSpecialChannel) {
    message.delete();
    fs.readdir(pwd, async (err, files) => {
        let trueFile = [];
        for (let file of files) {
            if (file.split(".").length > 1) {
                trueFile.push(pwd + file)
            }
        }

        await bot.basicFunctions.get("wait").run(250);
        bot.specialTextChannel.dataCenter.get("ls").run(bot, message, dataSpecialChannel);
        await bot.basicFunctions.get("wait").run(500);
        if (trueFile.length !== 0) {
            let mess = "Tous les fichiers de ce dossier ont été téléchargé";
            let filesToSend = [];
            for (let index = 0; index < trueFile.length; index++) {
                const element = trueFile[index];
                filesToSend.push(element);
                if (filesToSend.length >= 10) {
                    message.channel.send(mess, {
                        files: filesToSend
                    })
                    mess = "";
                    filesToSend = [];
                }
            }
            message.channel.send(mess, {
                files: filesToSend
            })

            /*
            if (trueFile.length < 10) {
            }else{
                let trueFile1 = [trueFile[0],trueFile[0],trueFile[0],trueFile[0],trueFile[0],trueFile[0]];
            }
            */
        }
    });
}

module.exports.run = async (bot, message, dataSpecialChannel) => {
    let args = message.content.split(" ");
    let pwd = dataSpecialChannel.data.pwd;

    let realPwd = pathToAdd + pwd;
    if (args[1] === "*") {
        dlAll(bot, message, realPwd, dataSpecialChannel);
        return;
    }

    args.splice(0, 1);
    var files = [];
    var noFiles = [];
    for (var i = 0; i < args.length; i++) {
        try {
            if (fs.existsSync(realPwd + args[i])) {
                files.push(realPwd + args[i])
            } else {
                noFiles.push(args[i])
            }
        } catch (err) {
            console.log("err")
        }
    }
    var messToSend = "";
    if (noFiles.length !== 0) {
        if (noFiles.length === 1) {
            messToSend = "Le fichier `" + noFiles[0] + "` n'est pas un fichier valide";
            message.channel.send(messToSend);
            await bot.basicFunctions.get("wait").run(100);
            bot.specialTextChannel.dataCenter.get("ls").run(bot, message, dataSpecialChannel);
            await bot.basicFunctions.get("wait").run(100);
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
            await bot.basicFunctions.get("wait").run(100);
            bot.specialTextChannel.dataCenter.get("ls").run(bot, message, dataSpecialChannel);
            await bot.basicFunctions.get("wait").run(100);
            message.channel.send(messToSend);
            return;
        }
        messToSend = messToSend + "\n";
    }
    if (files.length === 1) {
        let file = files[0].split("/")[files[0].split("/").length - 1]
        messToSend = messToSend + "Le fichier \"" + pwd + file + "\" à été téléchargé";
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
    await bot.basicFunctions.get("wait").run(250);
    bot.specialTextChannel.dataCenter.get("ls").run(bot, message, dataSpecialChannel);
    await bot.basicFunctions.get("wait").run(500);
    message.channel.send(messToSend, {
        files: files
    })
};

module.exports.help = {
    name: "dl"
};