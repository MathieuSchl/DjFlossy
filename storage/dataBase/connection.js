const mysql = require('mysql');
const fs = require("fs");
const dbConfig = require("./dbConfig.json");

function getDb() {
    const db = mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
        connectTimeout: 10000
    });
    return db;
}

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

module.exports.getDb = (callback) => {
    const db = getDb();

    db.connect(function (err) {
        if (err) throw err;

        callback(db);
    });
    return;
}

module.exports.close = (db) => {
    db.end();
    return;
}

module.exports.exec = (db, query, options, callback) => {
    if (callback == null && isFunction(options)) {
        callback = options;
        options = [];
    }

    db.query(query, options, function (error, results, fields) {
        try {
            callback(error, results, fields);
        } catch (e) {
            console.log("Error after SQL call");
            console.log(e);
            console.log("#########################");
            console.log(callback);
        }
        if (query[0] === "{") {
            console.log(query[0]);
        }
        return;
    });

    return;
};

function getQuery(tableName) {
    fichiers = fs.readFileSync(__dirname + "/dbQueries.json");
    let dbQueries = JSON.parse(fichiers);

    try {
        return dbQueries[tableName];
    } catch (e) {

    }
    return;
}

module.exports.createTable = (dbPrefix, tableName, callback) => {
    if (dbPrefix == null) throw new Error("'dbPrefix' is undefined");
    if (tableName == null) throw new Error("'tableName' is undefined");

    const db = getDb();

    db.connect(function (err) {
        if (err) throw err;

        const query = getQuery(tableName);
        const options = [dbConfig.database, dbPrefix + tableName];

        db.query(query, options, function (error, results, fields) {
            if (error) throw error;

            //console.log(results);
            //console.log(fields);
            console.log("Table \"" + dbPrefix + tableName + "\" has been created");

            db.end();
            if(callback) callback();
            return;
        });

    });
    return;
};


module.exports.help = {
    name: "connection"
};