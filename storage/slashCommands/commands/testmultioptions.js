const name = __filename.split("\\")[__filename.split("\\").length - 1].split(".")[0];


module.exports.runCmd = async (bot, channel, member, args) => {
    channel.send("Menu help");
};

module.exports.data = {
    name: name,
    description: "Permet d'avoir de l'aide",
    "options": [{
            "name": "animal",
            "description": "The type of animal",
            "type": 3,
            "required": true,
            "choices": [{
                    "name": "Dog",
                    "value": "animal_dog"
                },
                {
                    "name": "Cat",
                    "value": "animal_cat"
                },
                {
                    "name": "Penguin",
                    "value": "animal_penguin"
                }
            ]
        },
        {
            "name": "only_smol",
            "description": "Whether to show only baby animals",
            "type": 5,
            "required": false
        }
    ]
};

module.exports.help = {
    name: name,
    globalCommand: true
};