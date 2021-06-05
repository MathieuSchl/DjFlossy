const fs = require('fs');
const config = require('../config.json');
const witClient = require('node-witai-speech');


module.exports.run = async (fileName, callBack) => {
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
                console.log(err);
            });
    } catch (e) {
        fs.unlinkSync(fileName);
        console.log(e);
    }
};

module.exports.help = {
    name: "speechToText"
};