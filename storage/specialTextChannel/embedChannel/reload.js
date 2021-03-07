const Discord = require("discord.js");

async function check(value) {
    if (value == null) return false;
    if (value === "") return false;
    return true
}

async function createEmbed(data) {
    const theEmbed = new Discord.MessageEmbed();

    if (await check(data.title)) theEmbed.setTitle(data.title);
    if (await check(data.color)) theEmbed.setColor(data.color);
    if (await check(data.URL)) theEmbed.setURL(data.URL);
    if (await check(data.author)) theEmbed.setAuthor(data.author[0], data.author[1], data.author[2]);
    if (await check(data.description)) theEmbed.setDescription(data.description);
    if (await check(data.thumbnail)) theEmbed.setThumbnail(data.thumbnail);
    if (await check(data.fields)) theEmbed.addFields(data.fields);
    if (await check(data.image)) theEmbed.setImage(data.image);
    if (data.timestamp) theEmbed.setTimestamp;
    if (await check(data.footer)) theEmbed.setFooter(data.footer[0],data.footer[1]);


    return theEmbed;
}

module.exports.run = async (bot, channel, dataSpecialChannel) => {
    await bot.basicFunctions.get("wait").run(1000);
    const count = Array.from(channel.messages.cache).length;

    switch (count) {
        case 0:
            channel.send(await createEmbed(dataSpecialChannel.data));
            break;
        case 1:
            const message = await Array.from(channel.messages.cache)[0][1];
            if (message.editable) {
                message.edit(await createEmbed(dataSpecialChannel.data));
                break;
            }
            default:
                channel.messages.fetch().then(messages => {
                    messages.array().reverse().forEach(msg => {
                        if (!msg.deleted) msg.delete();
                    });
                })
                channel.send(await createEmbed(dataSpecialChannel.data));
    }
}

module.exports.getEmbed = async (dataSpecialChannel) => {
    return await createEmbed(dataSpecialChannel.data);
}

module.exports.help = {
    name: "reload"
};