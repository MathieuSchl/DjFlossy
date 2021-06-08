const fs = require('fs');
const config = require('../config.json');
const witClient = require('node-witai-speech');
const minDuration = 0.7;
const maxDuration = 5.0;
const FileWriter = require('wav').FileWriter;


function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

async function convert_audio(input) {
    try {
        // stereo to mono channel
        const data = new Int16Array(input)
        const ndata = new Int16Array(data.length / 2)
        for (let i = 0, j = 0; i < data.length; i += 4) {
            ndata[j++] = data[i]
            ndata[j++] = data[i + 1]
        }
        return Buffer.from(ndata);
    } catch (e) {
        console.log(e)
        console.log('convert_audio: ' + e)
        throw e;
    }
}


async function test(fileName, callBack) {
    try {
        var stream = fs.createReadStream(fileName);

        // The content-type for this audio stream (audio/wav, ...)
        var content_type = "audio/wav";

        // Its best to return a promise
        var parseSpeech = new Promise((ressolve, reject) => {
            // call the wit.ai api with the created stream
            witClient.extractSpeechIntent(config.witaiToken, stream, content_type,
                (err, res) => {
                    if (err) return reject(err);
                    ressolve(res);
                });
        });

        // check in the promise for the completion of call to witai
        parseSpeech.then((data) => {
                fs.unlinkSync(fileName);
                if (data.text) callBack(data.text);
            })
            .catch((err) => {
                fs.unlinkSync(fileName);
                //console.log(err);
            });
    } catch (e) {
        fs.unlinkSync(fileName);
    }
}




module.exports.run = async (bot, connection, callBack) => {
    connection.on('speaking', async (user, speaking) => {
        if (speaking.bitfield == 0 || user.bot) {
            return
        }
        // this creates a 16-bit signed PCM, stereo 48KHz stream
        const audioStream = connection.receiver.createStream(user, {
            mode: 'pcm'
        })
        audioStream.on('error', (e) => {
            console.log('audioStream: ' + e)
        });
        let buffer = [];
        audioStream.on('data', (data) => {
            buffer.push(data)
        })
        audioStream.on('end', async () => {
            buffer = Buffer.concat(buffer);
            const duration = buffer.length / 48000 / 4;

            if (duration < minDuration || duration > maxDuration) {
                return;
            }

            const soundId = makeid(20);
            const fileName = config.location + "/storage/data/sounds/output_" + soundId + ".wav";
            var outputFileStream = new FileWriter(fileName, {
                sampleRate: 22000,
                channels: 1
            });


            let new_buffer = await convert_audio(await convert_audio(buffer));

            outputFileStream.write(new_buffer);
            await bot.basicFunctions.get("wait").run(duration * 10);

            outputFileStream.end();

            try {
                bot.textToSpeech.get("speechToText").run(fileName, async (voiceMessage) => {
                    callBack(voiceMessage, user);
                });
            } catch (e) {
                console.log('tmpraw rename: ' + e)
            }
        });
    });
};

module.exports.help = {
    name: "listener"
};