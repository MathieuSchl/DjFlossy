const pathSlashCommand = require("../config.json").location + "/storage/slashCommands/commands/";
const fs = require('fs');


const checkIfIsEqual = ((command, element) => {
    if (command.name !== element.name) return false;
    if (command.description !== element.description) return false;
    if (command.options || element.options) {
        if (!command.options) return false;
        if (!element.options) return false;
        if (command.options.length !== element.options.length) return false;
        for (let index = 0; index < element.options.length; index++) {
            const commandOption = command.options[index];
            const elementOption = element.options[index];
            if (commandOption.name !== elementOption.name) return false;
            if (commandOption.description !== elementOption.description) return false;
            if (commandOption.type !== elementOption.type) return false;
            if ((commandOption.required == null ? false : commandOption.required) != (elementOption.required == null ? false : elementOption.required)) return false;
            if (commandOption.choices || elementOption.choices) {
                if (!commandOption.choices) return false;
                if (!elementOption.choices) return false;
                if (commandOption.choices.length !== elementOption.choices.length) return false;
                for (let indexChoises = 0; indexChoises < commandOption.choices.length; indexChoises++) {
                    const commandChoice = commandOption.choices[indexChoises];
                    const elementChoice = elementOption.choices[indexChoises];
                    if (commandChoice.name !== elementChoice.name) return false;
                    if (commandChoice.value !== elementChoice.value) return false;
                }
            }
        }
    }
    return true;
})

function getCommandsToAdd(bot, path, dataGuild, callback) {
    fs.readdir(path, (err, files) => {
        if (err) throw err;

        if (!dataGuild) {
            callback(files);
            return;
        }

        if (dataGuild.slashCommands[0] === "*") {
            callback(files);
            return;
        }
        callback(dataGuild.slashCommands);
    })
}

function getCommands(bot, idGuild, callback) {
    if (!idGuild) {
        bot.api.applications(bot.user.id).commands.get().then((res) => {
            callback(res);
        })
    } else {
        bot.api.applications(bot.user.id).guilds(idGuild).commands.get().then((res) => {
            callback(res);
        })
    }
}

function addCommand(bot, idGuild, data) {
    if (!idGuild) {
        bot.api.applications(bot.user.id).commands.post({
            data: data
        })
    } else {
        bot.api.applications(bot.user.id).guilds(idGuild).commands.post({
            data: data
        })
    }
}

function deleteCommand(bot, idGuild, idCommand) {
    if (!idGuild) {
        bot.api.applications(bot.user.id).commands(idCommand).delete();
    } else {
        bot.api.applications(bot.user.id).guilds(idGuild).commands(idCommand).delete();
    }
}

module.exports.checkOne = async (bot, dataGuild, path, callback) => {
    const idGuild = dataGuild ? dataGuild.id : null;
    getCommands(bot, idGuild, (res) => {
        getCommandsToAdd(bot, path, dataGuild, (files) => {
            for (let index = files.length - 1; index >= 0; index--) {
                try {
                    const ifGlobalCommand = require(path + files[index]).help.globalCommand;
                    if ((ifGlobalCommand && (dataGuild == null)) || (!ifGlobalCommand && (dataGuild != null))) files[index] = require(path + files[index]).data;
                    else files.splice(index, 1);
                } catch (e) {
                    files.splice(index, 1);
                }
            };

            res.forEach(command => {
                let find = false;

                for (let index = 0; index < files.length; index++) {
                    const element = files[index];
                    if (command.name === element.name) {
                        const isEqual = checkIfIsEqual(command, element);
                        if (isEqual) {
                            find = true;
                            files.splice(index, 1);
                            break;
                        }
                    }
                }

                if (!find) {
                    deleteCommand(bot, idGuild, command.id);
                }
            });

            files.forEach(element => {
                addCommand(bot, idGuild, element);
            });


            bot.setTimeout(() => {
                callback();
            }, 2500);
        });
        return;
    })
};

function checkAll(bot, callback) {
    bot.slashCommands.get("startCommands").checkOne(bot, null, pathSlashCommand, () => {
        bot.basicFunctions.get("dbDataSpecialGuild").selectAll(bot, (error, results, fields) => {
            if (error) throw error;

            for (let index = 0; index < results.length; index++) {
                const element = results[index];
                bot.slashCommands.get("startCommands").checkOne(bot, element, pathSlashCommand, () => {
                    callback();
                });
            }
        });
    });
}

module.exports.run = async (bot) => {
    checkAll(bot, () => {
        bot.ws.on('INTERACTION_CREATE', async (interaction) => {
            bot.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 5
                    }
                })
                .then(async (res) => {
                    //console.log(interaction);
                    const command = interaction.data.name.toLowerCase();
                    const args = interaction.data.options;
                    const channel = await bot.channels.fetch(interaction.channel_id);
                    channel.messages.fetch().then(async (messages) => {
                        const messagesArray = messages.array();
                        const message = messagesArray[0];
                        const channel = await bot.channels.fetch(interaction.channel_id);
                        if (message && message.deletable) message.delete();
                        try {
                            const member = interaction.member ? await channel.guild.members.fetch(interaction.member.user.id) : await bot.users.fetch(interaction.user.id);
                            require(pathSlashCommand + command).runCmd(bot, channel, member, args);
                        } catch (e) {
                            console.log(e);
                            channel.send("Internal error with the command `/" + command + "`");
                        }
                    })
                }).catch(() => {})
        })
    });
    return;
};

module.exports.help = {
    name: "startCommands"
};