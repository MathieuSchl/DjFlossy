const fs = require('fs');
const config = require('../config.json');
var wavConverter = require('wav-converter')
var path = require('path')


function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

module.exports.run = async (bot, connection, callBack) => {
    connection.on('speaking', async (user, speaking) => {
        if (speaking.bitfield == 0 || user.bot) {
            return
        }
        // this creates a 16-bit signed PCM, stereo 48KHz stream
        const audioStream = connection.receiver.createStream(user, {
            mode: 'pcm',
            end: "silence"
        })

        const theId = makeid(20)
        const file = config.location + "/storage/data/sounds/output_" + theId;
        const writer = audioStream.pipe(fs.createWriteStream(file + ".pcm"))
        writer.on("finish", () => {
            var pcmData = fs.readFileSync(path.resolve(file + ".pcm"))
            var wavData = wavConverter.encodeWav(pcmData, {
                numChannels: 1,
                sampleRate: 95000,
                byteRate: 16
            })

            fs.writeFile(path.resolve(file + ".wav"), wavData, async () => {
                fs.unlinkSync(file + ".pcm")

                try {
                    bot.textToSpeech.get("speechToText").run(file + ".wav", async (voiceMessage) => {
                        callBack(voiceMessage, user);
                    });
                } catch (e) {
                    console.log('tmpraw rename: ' + e)
                }
            })
        })
        return;
    });
};

module.exports.help = {
    name: "listener"
};