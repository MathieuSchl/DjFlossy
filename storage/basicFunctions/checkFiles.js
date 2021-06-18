const fs = require("fs");

module.exports.run = async (bot, location, callback) => {
    let allGood = true;

    //check if the config file is good
    if (!fs.existsSync(location + "storage/config.json")) {
        allGood = false;
        const config = {
            "token": "YourTockenHere",
            "prefix": "YourPrefixHere",
            "location": location
        };
        const data = JSON.stringify(config);
        fs.writeFileSync(location + "storage/config.json", data);
        console.log("The config file as been created here\n" +
            location + "storage/config.json\n" +
            "Please put your Discord bot tocken and your prefix\n");
    } else {
        fichiers = fs.readFileSync(location + "storage/config.json");
        const config = JSON.parse(fichiers);
        if (config.token === "YourTockenHere") {
            allGood = false;
            console.log("The tocken of your discord bot is missing.\n" +
                "Please put it in this file\n" +
                location + "storage/config.json\n");
        }
        if (config.prefix === "YourPrefixHere") {
            allGood = false;
            console.log("The prefix of your discord bot is missing.\n" +
                "Please put it in this file\n" +
                location + "storage/config.json\n");
        }
        if (config.location !== location) {
            allGood = false;
            config.location = location;
            let data = JSON.stringify(config);
            fs.writeFileSync(location + "storage/config.json", data);
            console.log("The path of the bot as been updated");
        }
    }


    //check if the database config file is good
    if (!fs.existsSync(location + "storage/dataBase/dbConfig.json")) {
        allGood = false;
        const dbConfig = {
            "host": "hostHere",
            "user": "userHere",
            "password": "passwordHere",
            "database": "databaseHere"
        };
        const data = JSON.stringify(dbConfig);
        fs.writeFileSync(location + "storage/dataBase/dbConfig.json", data);
        console.log("The dbconfig file as been created here\n" +
            location + "storage/dataBase/dbConfig.json\n" +
            "Please set your db information for the connection\n");
    } else {
        fichiers = fs.readFileSync(location + "storage/dataBase/dbConfig.json");
        const config = JSON.parse(fichiers);
        if (config.host === "hostHere") {
            allGood = false;
            console.log("The host to the data base connection is missing.\n" +
                "Please put it in this file\n" +
                location + "storage/dataBase/dbConfig.json\n");
        }
        if (config.user === "userHere") {
            allGood = false;
            console.log("The user to the data base connection is missing.\n" +
                "Please put it in this file\n" +
                location + "storage/dataBase/dbConfig.json\n");
        }
        if (config.password === "passwordHere") {
            allGood = false;
            console.log("The password to the data base connection is missing.\n" +
                "Please put it in this file\n" +
                location + "storage/dataBase/dbConfig.json\n");
        }
        if (config.database === "databaseHere") {
            allGood = false;
            console.log("The name of the database for the connection is missing.\n" +
                "Please put it in this file\n" +
                location + "storage/dataBase/dbConfig.json\n");
        }
    }

    //check if data folder exist
    if (!fs.existsSync(location + "storage/data")) fs.mkdirSync(location + "storage/data");

    if (allGood) {
        callback();
    } else {
        bot.destroy();
        process.exit(0);
    }
};

module.exports.help = {
    name: "checkFiles"
};