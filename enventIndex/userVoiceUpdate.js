async function getUserData(bot, userId, callback) {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ?? WHERE `id` = ?', [dbPrefix + "userData", userId], (error, results, fields) => {
        if (error) throw error;

        const userData = results[0];
        callback(userData);
    });
}

function detectTheAction(oldState, newState) {
    if ((oldState.serverMute) === false && (newState.serverMute) === true) return "serverMute";
    if ((oldState.serverDeaf) === false && (newState.serverDeaf) === true) return "serverDeaf";
    if (oldState.channel && !newState.channel) return "disconect";
    return false;
}

async function readLogs(guild, userId, action, callback) {
    const logs = Array.from((await guild.fetchAuditLogs({
        "limit": 1
    })).entries);

    const log = logs[0][1];
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
    switch (theAction) {
        case 'serverMute':
            readLogs(guild, newState.member.id, {
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
            readLogs(guild, newState.member.id, {
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
        case 'disconect':
            readLogs(guild, newState.member.id, {
                "actionType": "MEMBER_DISCONNECT"
            }, async (executor) => {
                const target = newState.member;
                if (executor.id === bot.user.id || executor.id === target.id) return;
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
            console.log(`"${expr}" is not defined`);
    }
    return;
};


module.exports.help = {
    name: "userVoiceUpdate"
};