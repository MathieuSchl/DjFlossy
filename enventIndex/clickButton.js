module.exports.run = async (bot, button) => {
    try {
        await bot.buttons[button.id].get("index").run(bot, button);
        button.defer();
    } catch (error) {

    }
};


module.exports.help = {
    name: "clickButton"
};