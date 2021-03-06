const fs = require('fs');
const config = require('../config.json');
const witClient = require('node-witai-speech');


async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports.run = async (fileName, callBack) => {
    try {
        if (!fs.existsSync(fileName)) return;
        //create an error if the file cant be read
        fs.readFileSync(fileName);
        //if the file cant be read this command crash the bot
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
        await wait(250);
        fs.unlinkSync(fileName);
        //console.log(e);
    }
};

module.exports.help = {
    name: "speechToText"
};