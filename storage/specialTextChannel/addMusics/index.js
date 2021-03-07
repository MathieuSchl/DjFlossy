module.exports.run = async (bot, message, dataSpecialChannel) => {
    message.delete();
    if(dataSpecialChannel.data.status==="URL"){
        bot.specialTextChannel.addMusics.get("add").run(bot, message, dataSpecialChannel);
    }else if(dataSpecialChannel.data.status==="playList"){
        bot.specialTextChannel.addMusics.get("playList").run(bot, message, dataSpecialChannel);
    }else{
        console.log("Status of channel 'addMusic' is unknown : '"+dataSpecialChannel.data.status+"'")
    }
}

module.exports.help = {
    name: "index"
};