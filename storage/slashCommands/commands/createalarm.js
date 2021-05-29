const getName = () => {
    const path = __filename;
    const slashPath = path.split("/");
    const backSlashPath = path.split("\\");
    if (slashPath.length !== 1) {
        return slashPath[slashPath.length - 1].split(".")[0];
    }
    if (backSlashPath.length !== 1) {
        return backSlashPath[backSlashPath.length - 1].split(".")[0];
    } else {
        return null;
    }
}

const name = getName();
const Discord = require('discord.js');


module.exports.runCmd = async (bot, channel, member, args) => {
    //Check is date as 3 elements
    const stringDate = args[0].value.split("/");
    if (stringDate.length !== 3) {
        const errorEmbed = new Discord.MessageEmbed()
            .setColor('#FF0404')
            .setTitle('Erreur avec la date')
            .setDescription('La date entrée n\'est pas valide.\n' +
                "Elle doit être au format `jj/mm/aaaa`");
        member.user.send(errorEmbed);
        return;
    };

    //Check if elements of date are numbers 
    const intDate = stringDate.map(x => parseInt(x));
    for (let index = 0; index < intDate.length; index++) {
        const element = intDate[index];
        if (isNaN(element)) {
            const errorEmbed = new Discord.MessageEmbed()
                .setColor('#FF0404')
                .setTitle('Erreur avec la date')
                .setDescription('La date entrée n\'est pas valide.\n' +
                    "Les valeurs de la date ne sont pas des chiffres.\n" +
                    `Valeur reçu : \`${args[0].value}\``);
            member.user.send(errorEmbed);
            return;
        }
    }

    //Check is hour as 2 elements
    const stringHours = args[1].value.split(":");
    if (stringHours.length !== 2) {
        const errorEmbed = new Discord.MessageEmbed()
            .setColor('#FF0404')
            .setTitle('Erreur avec l\'heure')
            .setDescription('L\'heure entrée n\'est pas valide.\n' +
                "Elle doit être au format `hh:mm`");
        member.user.send(errorEmbed);
        return;
    };

    //Check if elements of hour are numbers 
    const intHours = stringHours.map(x => parseInt(x));
    for (let index = 0; index < intHours.length; index++) {
        const element = intHours[index];
        if (isNaN(element)) {
            const errorEmbed = new Discord.MessageEmbed()
                .setColor('#FF0404')
                .setTitle('Erreur avec l\'heure')
                .setDescription('L\'heure entrée n\'est pas valide.\n' +
                    "Les valeurs de l\'heure ne sont pas des chiffres.\n" +
                    `Valeur reçu : \`${args[1].value}\``);
            member.user.send(errorEmbed);
            return;
        }
    }

    //Check if elements of hour are numbers 
    const message = args[2].value;
    if ((!message) || (message == "")) {
        const errorEmbed = new Discord.MessageEmbed()
            .setColor('#FF0404')
            .setTitle('Erreur avec le message à envoyer')
            .setDescription('Le message ne peux pas être vide');
        member.user.send(errorEmbed);
        return;
    }

    const year = intDate[2];
    const month = intDate[1];
    const date = intDate[0];
    const hours = intHours[0];
    const minutes = intHours[1];
    const nowDate = new Date();

    //Check if year is correct 
    if (year > nowDate.getFullYear() + 10) {
        const errorEmbed = new Discord.MessageEmbed()
            .setColor('#FF6B04')
            .setTitle("Erreur avec l'année entrée")
            .setDescription("Une alarme dans " + (year - nowDate.getFullYear()) + " ans !\n" +
                "On va peut être se calmer");
        member.user.send(errorEmbed);
        return;
    }

    //Check if month is correct 
    if (month < 1 || 12 < month) {
        const errorEmbed = new Discord.MessageEmbed()
            .setColor('#FF0404')
            .setTitle("Erreur avec le mois entré")
            .setDescription("Le mois entré n'est pas valide\n" +
                "Il doit être compris entre 1 et 12\n" +
                `Valeur reçu : \`${month}\``);
        member.user.send(errorEmbed);
        return;
    }

    //Check if hours is correct 
    if (hours < 0 || 23 < hours) {
        const errorEmbed = new Discord.MessageEmbed()
            .setColor('#FF0404')
            .setTitle("Erreur avec l'heure entrée")
            .setDescription("L'heure entrée n'est pas valide\n" +
                "Elle doit être comprise entre 0 et 23\n" +
                `Valeur reçu : \`${month}\``);
        member.user.send(errorEmbed);
        return;
    }

    //Check if minutes is correct 
    if (minutes < 0 || 59 < minutes) {
        const errorEmbed = new Discord.MessageEmbed()
            .setColor('#FF0404')
            .setTitle("Erreur avec la valeur des minutes")
            .setDescription("La valeur des minutes n'est pas valide\n" +
                "Elle doit être comprise entre 0 et 59\n" +
                `Valeur reçu : \`${month}\``);
        member.user.send(errorEmbed);
        return;
    }

    const cronDate = new Date(year, month - 1, date, hours, minutes);
    //Check if date is correct 
    if (isNaN(cronDate.getTime())) {
        const errorEmbed = new Discord.MessageEmbed()
            .setColor('#FF0404')
            .setTitle("Erreur avec la Date")
            .setDescription("La date entré n'est pas valide\n" +
                `Mais je sais pas pourquoi`);
        member.user.send(errorEmbed);
        return;
    }

    //Check if date is correct 
    if (cronDate.getFullYear() !== year || cronDate.getMonth() !== month - 1 || cronDate.getDate() !== date) {
        const errorEmbed = new Discord.MessageEmbed()
            .setColor('#FF0404')
            .setTitle("Erreur avec le jour entré")
            .setDescription("Le jour entré n'est pas valide\n" +
                `Valeur reçu : \`${date}\``);
        member.user.send(errorEmbed);
        return;
    }

    //Check if the alarm is before now is correct 
    if (nowDate > cronDate) {
        const errorEmbed = new Discord.MessageEmbed()
            .setColor('#FF6B04')
            .setTitle("Erreur avec la Date")
            .setDescription("L'alarme ne peut être dans le passé\n" +
                `Valeur reçu : \`${("0" + date).slice(-2)}/${("0" + month).slice(-2)}/${year} ${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}\`\n` +
                `Il est actuellement : \`${("0" + nowDate.getDate()).slice(-2)}/${("0" + nowDate.getMonth()).slice(-2)}/${nowDate.getFullYear()} ${("0" + nowDate.getHours()).slice(-2)}:${("0" + nowDate.getMinutes()).slice(-2)}\``);
        member.user.send(errorEmbed);
        return;
    }




    //All good
    const goodEmbed = new Discord.MessageEmbed()
        .setColor('#1BFF04')
        .setTitle("Alarme enregistrée")
        .setDescription("L'alarme à été enregistré\n" +
            `Vous receverez le message : \`${message}\`\n` +
            `à : \`${("0" + date).slice(-2)}/${("0" + month).slice(-2)}/${year} ${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}\``);
    member.user.send(goodEmbed);

    const cronSchedule = "00 " + ("0" + nowDate.getMinutes()).slice(-2) + " " + ("0" + nowDate.getHours()).slice(-2) + " " + ("0" + nowDate.getDate()).slice(-2) + " " + ("0" + nowDate.getMonth()).slice(-2) + " *";

    const data = {
        "cronSchedule": cronSchedule,
        "repetitive": 0,
        "type": "MP",
        "user": member.user.id,
        "data": {
            "year": nowDate.getFullYear(),
            "mess": message
        }
    }

    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec(bot.db, 'INSERT INTO ?? (`cronSchedule`, `repetitive`, `type`, `user`, `data`) VALUES (?, ?, ?, ?, ?)', [dbPrefix + "cronTables", data.cronSchedule, data.repetitive, data.type, data.user, JSON.stringify(data.data)], async (error, results, fields) => {
        if (error) throw error;

        bot.dataBase.get("connection").exec(bot.db, 'SELECT * FROM ?? WHERE id = (SELECT MAX(id) FROM ??)', [dbPrefix + "cronTables", dbPrefix + "cronTables"], async (error, results, fields) => {
            if (error) throw error;


            results[0].data = JSON.parse(results[0].data);

            const theCron = results[0];

            const res = await bot.enventIndex.get("cronTab").start(bot, theCron);
            if (res) {
                bot.cronTab.set(res.name, res.job);
                bot.cronTab.get(res.name).start();
            }
            console.log(res);
        });
        return;
    });
    return;
};

module.exports.data = {
    name: name,
    description: "Create an alarm to remind you of something important",
    options: [{
            "name": "date",
            "description": "The date of the alarm with format dd/mm/yyyy",
            "type": 3,
            "required": true
        },
        {
            "name": "hour",
            "description": "Hours and minutes of the alarm with format hh:mm",
            "type": 3,
            "required": true
        },
        {
            "name": "message",
            "description": "Message to send",
            "type": 3,
            "required": true
        }
    ]
};

module.exports.help = {
    name: name,
    globalCommand: true
};