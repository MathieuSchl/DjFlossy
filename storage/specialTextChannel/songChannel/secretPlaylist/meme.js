const name = "meme";
const acceptedWord = ["meme"];
const playlistIndexInDB = 6;


function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

module.exports.run = async (bot, message, dataSpecialChannel) => {
    bot.dataBase.get("connection").exec(bot.db, 'SELECT idMusic FROM ?? WHERE idTag = ?', ["musicsCorrelation", playlistIndexInDB], (error, results, fields) => {
        if (error) throw error;

        let musicsList = [];
        for (let index = 0; index < results.length; index++) {
            const element = results[index].idMusic;

            musicsList.push(element);
        }
        musicsList = shuffle(musicsList);
        if(musicsList.length>=50) musicsList.splice(50, musicsList.length);
        bot.specialTextChannel["songChannel"].get("customSong").updatePlaylist(bot, message, musicsList, true);
        if (message.deletable) message.delete();
        bot.specialTextChannel["songChannel"].get("achievementsRunSecretPlaylist").run(bot, message.author, name);
    });
}

module.exports.help = {
    name: name,
    acceptedWord: acceptedWord
};