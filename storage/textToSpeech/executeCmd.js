module.exports.run = async (bot, connection, voiceMessage, user) => {
    console.log(voiceMessage);
    bot.textToSpeech.get("chatBot").run(bot, connection, voiceMessage, user);



    /*
    const textChannel = await bot.channels.fetch("833106824437301289");
    textChannel.send(voiceMessage);
    const args = voiceMessage.split(" ");

    for (let index = 0; index < args.length; index++) {
        const element = args[index];

        if (bot.voiceCommandsList.includes(element)) {
            const elementIndex = bot.voiceCommandsList.indexOf(element);
            console.log(elementIndex);
            const newArgs = []
            for (let indexArgs = elementIndex; indexArgs < args.length; indexArgs++) {
                const arg = args[indexArgs];
                newArgs.push(arg);
            }
            console.log(newArgs);
        }
    }
    */
};

module.exports.help = {
    name: "executeCmd"
};