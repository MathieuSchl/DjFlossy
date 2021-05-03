module.exports.run = async (bot, channel) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'DELETE FROM ?? WHERE `channel` = ?', [dbPrefix + "specialMessage", channel.id], (error, results, fields) => {
        if (error) throw error;
        return;
    });
    channel.bulkDelete(100).catch(() => {});
    channel.messages.fetch().then(messages => {
        messages.array().forEach(msg => {
            setTimeout(function () {
                if (!msg.deleted) msg.delete().catch(() => {});
            }, 100);
        });
    })
};


module.exports.help = {
    name: "deleteAll"
};