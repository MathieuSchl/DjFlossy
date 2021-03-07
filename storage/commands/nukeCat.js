const config = require("../config.json");

module.exports.run = async (bot, message, dataSpecialChannel)=>{
    if (!message.member.hasPermission("ADMINISTRATOR")) {
        message.channel.send("Tu n'es pas autorisé à faire ca !").then(async (msg) => {
            await bot.basicFunctions.get("wait").run(10000);
            if (!msg.deleted) msg.delete();
        })
        return;
    }
    const category = message.channel.parent;
    for(let element of Array.from(category.children)){
        element = element[1];
        element.delete();
        await bot.basicFunctions.get("wait").run(2000);
    }
    category.delete();
};


module.exports.help = {
    name: "nukeCat"
};