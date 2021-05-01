const AssistantV2 = require('ibm-watson/assistant/v2');
const {
    IamAuthenticator
} = require('ibm-watson/auth');
const Discord = require('discord.js');
const watsonConfig = require("../watsonConfig.json");


function getAssistant(apikey, callBack) {
    const assistant = new AssistantV2({
        version: watsonConfig.version,
        authenticator: new IamAuthenticator({
            apikey: watsonConfig.assistantsList[apikey].apiKey,
        }),
        serviceUrl: watsonConfig.serviceUrl,
    });
    callBack(assistant);
}

function createSeession(assistant, assistantName, callBack) {
    assistant.createSession({
            assistantId: watsonConfig.assistantsList[assistantName].assistantId
        })
        .then(res => {
            const sessionId = res.result.session_id;
            callBack(sessionId);
        })
        .catch(err => {
            console.log(err);
        });
}

function sendMessage(bot, assistant, userId, data, message, callBack) {
    assistant.message({
            assistantId: watsonConfig.assistantsList[data.assistant].assistantId,
            sessionId: data.sessionId,
            input: {
                'message_type': 'text',
                'text': message
            }
        })
        .then(res => {
            callBack(res);
        })
        .catch(err => {
            if (err.message === "Invalid Session") {
                createAndSaveSession(bot, assistant, userId, data, (newData) => {
                    sendMessage(bot, assistant, userId, newData, message, callBack);
                });
            } else {
                console.log(message);
                console.log(err);
            }
        });
}

function deleteSession(assistant, assistantName, sessionId) {
    assistant.deleteSession({
            assistantId: watsonConfig.assistantsList[assistantName].assistantId,
            sessionId: sessionId,
        })
        .then(res => {
            //console.log(JSON.stringify(res.result, null, 2));
        })
        .catch(err => {
            console.log(err);
        });
}

async function archiveQuestion(bot, userMessage, messageToSend, category, assistantName, user, VC) {
    if (!watsonConfig.archiveChannel) return;
    const channel = await bot.channels.fetch(watsonConfig.archiveChannel);
    const messageEmbed = new Discord.MessageEmbed()
        .setColor('#FF9D18')
        .setTitle('Message pour Chloé')
        .setDescription('Utilisateur : `' + user.username + '`\n' +
            'Serveur : `' + VC.guild.name + '`\n' +
            'Channel : `' + VC.name + '`\n' +
            'Assitant : `' + assistantName + '`')
        .addFields({
            name: 'Question',
            value: '```' + userMessage + '```'
        }, {
            name: 'Réponse',
            value: 'Catégorie : ```' + category + '```\nRéponse : ```' + messageToSend + '```'
        })
        .setTimestamp()
    channel.send(messageEmbed);
}

async function getSession(bot, userId, callBack) {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ?? WHERE `id` = ?', [dbPrefix + "userData", userId], (error, results, fields) => {
        if (error) throw error;

        if (results.length === 0) {
            const data = {
                "sessionId": null,
                "assistant": "general"
            };
            bot.dataBase.get("connection").exec(bot.db, 'INSERT INTO ?? (`id`, `data`) VALUES (?, ?)', [dbPrefix + "userData", userId, JSON.stringify(data)], (error, results, fields) => {
                if (error) throw error;

                callBack(data);
            });
            return;
        }
        const data = JSON.parse(results[0].data);
        callBack(data);
    })
}

async function saveSession(bot, userId, data, callBack) {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'UPDATE ?? SET `data` = ? WHERE `id` = ?', [dbPrefix + "userData", JSON.stringify(data), userId], (error, results, fields) => {
        if (error) throw error;

        callBack();
    });
}

async function createAndSaveSession(bot, assistant, userId, data, callBack) {
    const assistantToCreate = data.assistant ? data.assistant : "general";
    createSeession(assistant, assistantToCreate, (sessionId) => {
        data.sessionId = sessionId;
        data.assistant = assistantToCreate;
        saveSession(bot, userId, data, () => {
            callBack(data);
        });
    });
}

async function processVoiceMessage(bot, assistant, connection, voiceMessage, user, data) {
    const userId = (connection.channel.guild.id + ">" + user.id);
    sendMessage(bot, assistant, userId, data, voiceMessage, (resMessage) => {
        //deleteSession(assistant,sessionId);
        try {
            const messageToSend = resMessage.result.output.generic[0].text;
            const category = resMessage.result.output.intents[0].intent;
            archiveQuestion(bot, voiceMessage, messageToSend, category, data.assistant, user, connection.channel);
            if (messageToSend) bot.textToSpeech.get("textToSpeech").run(bot, connection, messageToSend);
            else console.log(resMessage.result.output);
        } catch (e) {
            //console.log(resMessage);
        }
    });
}

module.exports.run = async (bot, connection, voiceMessage, user) => {
    const userId = (connection.channel.guild.id + ">" + user.id);
    getSession(bot, userId, (data) => {
        const assistantName = "general";
        getAssistant(assistantName, (assistant) => {
            if (!data.sessionId) {
                createAndSaveSession(bot, assistant, userId, data, (data) => {
                    processVoiceMessage(bot, assistant, connection, voiceMessage, user, data);
                });
                return;
            };
            processVoiceMessage(bot, assistant, connection, voiceMessage, user, data);
        })
    });
    return;
};

module.exports.help = {
    name: "chatBot"
};