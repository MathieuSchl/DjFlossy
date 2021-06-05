const googleTTS = require('google-tts-api'); // CommonJS


async function sayText(bot, connection, broadcast) {
  const guildId = connection.channel.guild.id;
  const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
  bot.dataBase.get("connection").exec(bot.db, 'SELECT `ttsAvailable`, `data` FROM ?? WHERE `id` = ?', [dbPrefix + "specialGuild", guildId], async (error, results, fields) => {
    if (error) throw error;

    const result = results[0];
    result.data = JSON.parse(result.data);
    if (result.data.waitingTTS.length === 0) {
      const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
      bot.dataBase.get("connection").exec(bot.db, 'UPDATE ?? SET `ttsAvailable` = ? WHERE `id` = ?', [dbPrefix + "specialGuild", true, guildId], (error, results, fields) => {
        if (error) throw error;
        broadcast.end();
        return;
      });
      return;
    }
    const text = result.data.waitingTTS[0];
    result.data.waitingTTS.shift();
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'UPDATE ?? SET `data` = ? WHERE `id` = ?', [dbPrefix + "specialGuild", JSON.stringify(result.data), guildId], async (error) => {
      if (error) throw error;

      const url = googleTTS.getAudioUrl(text, {
        lang: 'fr',
        slow: false,
        host: 'https://translate.google.com',
      });

      const dispatcher = broadcast.play(url, {
        "volume": 3
      });

      dispatcher.on("speaking", (value) => {
        dispatcher.destroy();
        sayText(bot, connection, broadcast);
        return;
      });
    });
  });
}


module.exports.run = async (bot, connection, text) => {
  const guildId = connection.channel.guild.id;
  const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
  bot.dataBase.get("connection").exec(bot.db, 'SELECT `ttsAvailable`, `data` FROM ?? WHERE `id` = ?', [dbPrefix + "specialGuild", guildId], async (error, results, fields) => {
    if (error) throw error;

    const result = results[0];
    result.data = JSON.parse(result.data);
    if (!result.data.waitingTTS) result.data.waitingTTS = [];
    result.data.waitingTTS.push(text);

    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'UPDATE ?? SET `data` = ? WHERE `id` = ?', [dbPrefix + "specialGuild", JSON.stringify(result.data), guildId], (error) => {
      if (error) throw error;

      if (!result.ttsAvailable) return;
      bot.dataBase.get("connection").exec(bot.db, 'UPDATE ?? SET `ttsAvailable` = ? WHERE `id` = ?', [dbPrefix + "specialGuild", false, guildId], (error, results, fields) => {
        if (error) throw error;

        const broadcast = bot.voice.createBroadcast();
        connection.play(broadcast);
        sayText(bot, connection, broadcast);
      });
    });
  });
};

module.exports.help = {
  name: "textToSpeech"
};