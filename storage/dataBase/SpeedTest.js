const fs = require('fs');
const Discord = require("discord.js");
const connection = require("./connection.js");
const path = __dirname + "/../botsList/";


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

module.exports.run = (callback) => {
    const start = new Date();

    connection.getDb((db) => {
        connection.exec(db, "SELECT 'test'", [], (error, results, fields) => {
            if (error) throw error;
            connection.close(db);

            const end = new Date();
            console.log("Db SpeedTest : ");
            console.log("Time : " + (end - start));
            console.log("\n\n");

            callback();
        });
    });
};


function testSpeedDiscord(callback) {
    const directories = fs.readdirSync(path).filter((file) => fs.lstatSync(path + file).isDirectory());
    for (let index = 0; index < directories.length; index++) {
        const element = directories[index];

        try {
            const config = require(path + element + "/storage/config.json");
            const bot = new Discord.Client();
            let connStart = null;
            let connEnd = null;
            let actionStart = null;
            let actionEnd = null;
            let msgId = null;

            bot.on("ready", async () => {
                connEnd = new Date();

                let channel = {};
                if (config.idConsoleChannel) {
                    channel = await bot.channels.fetch(config.idConsoleChannel);
                } else {
                    const channels = Array.from(bot.channels.cache);
                    while (channel.type !== "text") {
                        channel = channels[getRandomInt(channels.length)][1];
                    }
                }

                actionStart = new Date();
                channel.send("SpeedTest").then((msg) => {
                    msgId = msg.id;
                })
            });

            bot.on("message", message => {
                setTimeout(() => {
                    if (message.id === msgId) {
                        if (message.deletable) message.delete();
                        actionEnd = new Date();
                        setTimeout(() => {
                            bot.destroy();
                            callback((connEnd - connStart), (actionEnd - actionStart));
                        }, 250);
                    }
                }, 250);
            });


            connStart = new Date();
            bot.login(config.token);
            break;
        } catch {}
    }
    return;
}

function testSpeedQuerry(db, values, callback) {
    if (values.length >= 5) {
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        const res = Math.round((values.reduce(reducer) / values.length));
        callback(res);
        return;
    } else {
        const start = new Date();
        connection.exec(db, "SELECT 'test'", [], (error, results, fields) => {
            if (error) throw error;

            const end = new Date();
            values.push(end - start);
            testSpeedQuerry(db, values, (res) => {
                callback(res);
                return;
            })
            return;
        });
    }
}

module.exports.fullTests = (callback) => {
    const connStart = new Date();
    connection.getDb((db) => {
        const connEnd = new Date();
        testSpeedQuerry(db, [], (querryRes) => {
            testSpeedDiscord((discordConnRes, discordActionRes) => {

                connection.close(db);
                callback([(connEnd - connStart), querryRes, discordConnRes, discordActionRes]);
            })
        })
    });
}


module.exports.help = {
    name: "SpeedTest"
};