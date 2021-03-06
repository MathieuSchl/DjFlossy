async function getUserData(bot, userId, callback) {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ?? WHERE `id` = ?', [dbPrefix + "userData", userId], (error, results, fields) => {
        if (error) throw error;

        const userData = results[0];
        callback(userData);
    });
}

function detectTheAction(oldState, newState) {
    if (!oldState.channel && newState.channel) return "join";
    if (oldState.channel && !newState.channel) return "disconnect";
    if (oldState.channel && newState.channel && (oldState.channel.id !== newState.channel.id)) return "move";
    if ((oldState.serverDeaf) === false && (newState.serverDeaf) === true) return "serverDeaf";
    if ((oldState.serverMute) === false && (newState.serverMute) === true) return "serverMute";
    if ((oldState.serverDeaf) === true && (newState.serverDeaf) === false) return "serverUnDeaf";
    if ((oldState.serverMute) === true && (newState.serverMute) === false) return "serverUnMute";
    if ((oldState.selfDeaf) === false && (newState.selfDeaf) === true) return "selfDeaf";
    if ((oldState.selfMute) === false && (newState.selfMute) === true) return "selfMute";
    if ((oldState.selfDeaf) === true && (newState.selfDeaf) === false) return "selfUnDeaf";
    if ((oldState.selfMute) === true && (newState.selfMute) === false) return "selfUnMute";
    if ((oldState.selfVideo) === false && (newState.selfVideo) === true) return "startVideo";
    if ((oldState.selfVideo) === true && (newState.selfVideo) === false) return "endVideo";
    if ((oldState.streaming) === false && (newState.streaming) === true) return "startStreaming";
    if ((oldState.streaming) === true && (newState.streaming) === false) return "endStreaming";
    return false;
}

async function readLogs(guild, toDellete, action, callback) {
    const logs = Array.from((await guild.fetchAuditLogs({
        "limit": 1
    })).entries);

    if (!logs[0]) return;
    const log = logs[0][1];
    //console.log(log);
    const logTime = log.createdAt.getTime();
    const time = new Date().getTime();
    if (((time - 2000) > logTime) || (logTime >= (time + 2000))) {
        callback();
        return;
    }
    const executor = await guild.members.fetch(log.executor.id);

    if (log.action === action.actionType && action.actionType === "MEMBER_UPDATE") {
        const target = await guild.members.fetch(log.target.id);
        const lastChange = log.changes[log.changes.length - 1];
        if (lastChange.key === action.actionDetails) {
            callback(executor, target);
        }
    } else if (log.action === action.actionType && action.actionType === "MEMBER_DISCONNECT") {
        callback(executor);
    }
}

module.exports.run = async (bot, oldState, newState, oldDatavoiceChannel, newDatavoiceChannel) => {
    const theAction = detectTheAction(oldState, newState);
    if (!theAction) return;

    const guild = newState.guild;
    const time = new Date();
    switch (theAction) {
        case 'serverMute':
            readLogs(guild, time, {
                "actionType": "MEMBER_UPDATE",
                "actionDetails": "mute"
            }, async (executor, target) => {
                if (executor.id === bot.user.id || executor.id === target.id) return;
                const voiceExecutor = executor.voice;
                const voiceTarget = target.voice;
                const executorId = (newState.guild.id + ">" + executor.id);
                const targetId = (newState.guild.id + ">" + target.id);

                getUserData(bot, targetId, async (targetData) => {
                    if ((!targetData) || (!targetData.muteShield)) return;
                    getUserData(bot, executorId, async (executorData) => {
                        if ((executorData) && executorData.admin) return;
                        voiceExecutor.setMute(true);
                        voiceTarget.setMute(false);
                    });
                });
            });
            break;
        case 'serverDeaf':
            readLogs(guild, time, {
                "actionType": "MEMBER_UPDATE",
                "actionDetails": "deaf"
            }, async (executor, target) => {
                if (executor.id === bot.user.id || executor.id === target.id) return;
                const voiceExecutor = executor.voice;
                const voiceTarget = target.voice;
                const executorId = (newState.guild.id + ">" + executor.id);
                const targetId = (newState.guild.id + ">" + target.id);

                getUserData(bot, targetId, async (targetData) => {
                    if ((!targetData) || (!targetData.deafShield)) return;
                    getUserData(bot, executorId, async (executorData) => {
                        if ((executorData) && executorData.admin) return;
                        voiceExecutor.setDeaf(true);
                        voiceTarget.setDeaf(false);
                    });
                });
            });
            break;
        case 'disconnect':
            readLogs(guild, time, {
                "actionType": "MEMBER_DISCONNECT"
            }, async (executor) => {
                const target = newState.member;
                if (!executor || executor.id === bot.user.id || executor.id === target.id) return;
                const voiceExecutor = executor.voice;
                const voiceTarget = target.voice;
                const executorId = (newState.guild.id + ">" + executor.id);
                const targetId = (newState.guild.id + ">" + target.id);

                getUserData(bot, targetId, async (targetData) => {
                    if ((!targetData) || (!targetData.disconnectShield)) return;
                    getUserData(bot, executorId, async (executorData) => {
                        if ((executorData) && executorData.admin) return;
                        voiceExecutor.kick("This cannot be unpunished");
                    });
                });
            });
            break;
        default:
            //console.log(`"${theAction}" is not defined`);
    }
    return;
};

module.exports.detectTheAction = async (oldState, newState) => {
    return await detectTheAction(oldState, newState);
};

module.exports.readLogs = async (guild, time, action, callback) => {
    readLogs(guild, time, action, callback);
};

module.exports.help = {
    name: "userVoiceUpdate"
};