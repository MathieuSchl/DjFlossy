function sendToMember(member, messageToSend) {
    member.send(messageToSend);
}

module.exports.run = async (bot, messageToSend, channel, member) => {
    bot.basicFunctions.get("dbDataSpecialTextChannel").select(bot, channel.id, (error, results, fields) => {
        if (error) throw error;

        if (results.length !== 0) {
            sendToMember(member, messageToSend);
            return;
        }
        try {
            channel.send(messageToSend).then(async (msg) => {
                await bot.basicFunctions.get("wait").run(1500);
                //check if message is deleted
                await msg.fetch();
            }).catch(() => {
                sendToMember(member, messageToSend);
            });
        } catch {

        }
    });
};

module.exports.help = {
    name: "sendMessage"
};