const config = require('../../config.json');
const {
    spawn
} = require('child_process');

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports.run = async (bot, message, dataSpecialChannel)=>{
    if(message!=null){
        message.delete();
        message.channel.send("```Redémarage du bot dans 5s```").then((msg)=>{msg.delete({ timeout:5000 })});
        await wait(5500);
    }
    bot.destroy();
    bot.enventIndex.get("cronTab").stop(bot);
    await wait(5000);
    console.log("+------+\n|Reboot|\n+------+\n");
    //require('child_process').exec(`node ${config.location}/index.js`, function (msg) { console.log(msg) });


    const run = spawn('node', [config.location, 'index.js']);

    run.stdout.on('data', (data) => {
        data = data.toString();
        console.log(data.slice(0, -1));
    });

    run.stderr.on('data', (data) => {
        data = data.toString();
        console.log(data.slice(0, -1));
    });

    run.on('close', (code) => {
        run.stdin.end();
    });
};

module.exports.help = {
    name: "reboot"
};