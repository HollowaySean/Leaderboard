// DATABASE QUERY FUNCTIONS //
// ------------------------ //
// Note: This file has been largely deprecated after codebase rewrite

//// SETUP ////

// Connect to database
const mysql = require('mysql');
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 10
});
db.connect();

// Generic function to make queries
module.exports.executeQuery = async (queryString, callback) => {

    // Make query to database
    db.query(queryString, async (err, results) => {
        
        // Catch error and run callback
        if(!err) {
            callback(false, {rows: results});
        }else{
            callback(err, {});
        }
    });
};

// Generic wrapper for get functions
module.exports.getGeneric = async (tableName, key, values, callback) => {

    // Pass query to database
    let queryString = `SELECT * FROM ` + tableName + ` WHERE ` + key + ` IN (` + values + `);`
    module.exports.executeQuery(queryString, callback);
}

// Wrapper for userID based fetch requests 
module.exports.getFetchGeneric = async (req, res, tableName, key) => {
    try {

        // Pass query to database
        module.exports.getGeneric(tableName, key, req.query[key], async (err, results) => {

            // Catch errors
            if(err) throw err;

            // Send successful response
            res.status(200).json(results);
        });

    } catch {

        // Send unsuccessful response
        res.status(500).send();
    }
}

// Generic wrapper for get max
module.exports.getMax = async (tableName, key, values, keyMax, callback) => {

    // Pass query to database
    let queryString = `SELECT MAX(` + keyMax + `) AS maxVal FROM ` + tableName + ` WHERE ` + key + ` IN (` + values + `);`
    module.exports.executeQuery(queryString, callback);
}

// Generic wrapper for get max within fetch request
module.exports.getFetchMax = async (req, res, tableName, key, keyMax) => {
    try {

        // Pass query to database
        module.exports.getMax(tableName, key, req.query[key], keyMax, async (err, results) => {

            // Catch errors
            if(err) throw err;

            // Send successful response
            res.status(200).json(results);
        });

    } catch {

        // Send unsuccessful response
        res.status(500).send();
    }
}

// Wrapper for insert queries
module.exports.insertGeneric = async (tableName, keysValues, callback) => {

    // Pass query string to database
    let queryString = `INSERT INTO ` + tableName + ` (` + Object.keys(keysValues) + `) VALUES (` + mysql.escape(Object.values(keysValues)) +`);`
    module.exports.executeQuery(queryString, callback);
}

// Wrapper for insert query fetch requests 
module.exports.insertFetchGeneric = async (keysValues, res, tableName, returnKey) => {
    try {

        // Search userID in database
        module.exports.insertGeneric(tableName, keysValues, (err, results) => {

            // Handle errors
            if(err) throw err;

            // Pack data for return
            let returnData = keysValues;
            if(returnKey) {
                returnData[returnKey] = results.rows.insertId;
            }
            
            // Return list of user names
            res.status(201).json({rows: [returnData]});
        })

    } catch {

        // Send unsuccessful response
        res.status(500).send();
    }
}
