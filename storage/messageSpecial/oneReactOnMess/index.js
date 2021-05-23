module.exports.addReaction = async (bot, reaction, user, messageData, index) => {
    const reactions = Array.from(reaction.message.reactions.cache)
    for (let index = 0; index < reactions.length; index++) {
        const element = reactions[index];
        if (element[1]["_emoji"].name !== reaction["_emoji"].name) {
            if (element[1].count > 1) {
                const usersReact = Array.from(await element[1].users.fetch());
                for (let index = 0; index < usersReact.length; index++) {
                    const user = usersReact[index][1];
                    if(!user.bot){
                        element[1].users.remove(user)
                    }
                }
            }
        }
    }
}

module.exports.removeReaction = async (bot, reaction, user, messageData, index) => {}

module.exports.help = {
    name: "index"
};