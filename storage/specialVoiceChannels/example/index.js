module.exports.join = async (bot, oldState, oldDatavoiceChannel, newState, newDatavoiceChannel) => {
    console.log("User join");
    //newState.channel.join();
};

module.exports.leave = async (bot, oldState, oldDatavoiceChannel, newState, newDatavoiceChannel) => {
    console.log("User leave");
    //oldState.channel.leave();
};

module.exports.help = {
    name: "index"
};