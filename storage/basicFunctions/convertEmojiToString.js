const convertEmoji = require("../../../../dataBase/convertEmoji.json");
const convertEmojiKeyList = Object.keys(convertEmoji);
const convertEmojiValueList = Object.values(convertEmoji);

module.exports.run = async (emojiList) => {

    for (let index = 0; index < emojiList.length; index++) {
        const element = emojiList[index];
        const emojiIndex = convertEmojiValueList.indexOf(element);
        if (emojiIndex !== -1) emojiList[index] = convertEmojiKeyList[emojiIndex];
    }

    return emojiList;
};

module.exports.help = {
    name: "convertEmojiToString"
};