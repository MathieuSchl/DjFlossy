const request = require('request');
const key = require("../config.json").ytApiKey;


function getVideosTag(playlistId, videoList, nextPageToken, callback) {
    if (!videoList) videoList = [];
    const URL = "https://www.googleapis.com/youtube/v3/playlistItems?key=" + key + "&part=snippet&playlistId=" + playlistId + "&maxResults=50" + (nextPageToken ? "&pageToken=" + nextPageToken : "");
    request(URL, {}, (err, res, body) => {
        if (err) {
            console.log(err.code === "ETIMEDOUT");
            return console.log(err);
        }
        const bodyObject = JSON.parse(body);
        for (let index = 0; index < bodyObject.items.length; index++) {
            const element = bodyObject.items[index].snippet.resourceId.videoId;
            videoList.push(element);
        }
        if (bodyObject.nextPageToken) getVideosTag("PLNdO3e3fKSGdupU0x0d1chpiPrc9YBG71", videoList, bodyObject.nextPageToken, callback);
        else return callback(videoList)
    });
}

module.exports.run = async (playlistId, callback) => {
    return getVideosTag(playlistId, [], null, callback)
};

module.exports.help = {
    name: "getVideosFromYtPlaylist"
};