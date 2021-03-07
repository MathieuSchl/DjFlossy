const config = require("../config.json");
const fs = require("fs");
let indexMess = 0;
//  V Pararameters V
const uniqueActivity = true;

const uniqueActivityMessage = "Ici DjFlossy ! Lets go play Music !";
const uniqueActivityType = "PLAYING";

const intervalFromChange = 60000;
//  ^ Pararameters ^


async function getMessage(bot) {
    let mess = "";
    let type = "";

    switch (indexMess) {
        case 0:
            mess = "Message 1";
            type = "PLAYING";
            break;
        case 1:
            mess = "Message 2";
            type = "WATCHING";
            break;
        case 2:
            mess = "Message 3";
            type = "WATCHING";
        default:
            indexMess = 0;
            return await getMessage(bot);
    }

    indexMess++;
    return [type, mess];
}

async function changeActivity(bot) {
    const res = await getMessage(bot);
    bot.user.setActivity(res[1], {
        type: res[0]
    }).catch((e) => {});
}

module.exports.run = async (bot) => {
    if (uniqueActivity) {
        bot.user.setActivity(uniqueActivityMessage, {
            type: uniqueActivityType
        }).catch((e) => {});
    } else {
        changeActivity(bot);
        bot.setInterval(async function () {
            changeActivity(bot);
        }, intervalFromChange);
    }
}

module.exports.help = {
    name: "activity"
};