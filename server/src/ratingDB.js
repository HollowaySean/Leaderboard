
// Connect to database
const mysql = require('mysql');
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});
db.connect();

// Get all users in group
function usersInGroup(groupID, callback) {

    // MySQL query
    db.query('SELECT userID FROM `group_members` WHERE groupID = ' + mysql.escape(groupID) + ';', 
        function (err, results) {
            if(err) throw err;

            // Pack array of data
            let users = [];
            for(let i = 0; i < results.length; i++){
                users.push(results[i].userID);
            }

            // Send callback after completion
            callback(users);
        }
    );
}

// Get all decks in group
function decksInGroup(groupID, callback) {

    // MySQL query
    db.query('SELECT deck FROM `group_members` WHERE groupID = ' + mysql.escape(groupID) + ';', 
        function (err, results) {
            if(err) throw err;

            // Pack array of data
            let decks = [];
            for(let i = 0; i < results.length; i++){
                decks.push(results[i].deck);
            }

            // Send callback after completion
            callback(decks);
        }
    );
}

// Get all decks in group
function decksInUser(userID, callback) {

    // MySQL query
    db.query('SELECT deck FROM `group_members` WHERE userID = ' + mysql.escape(userID) + ';', 
        function (err, results) {
            if(err) throw err;

            // Pack array of data
            let decks = [];
            for(let i = 0; i < results.length; i++){
                decks.push(results[i].deck);
            }

            // Send callback after completion
            callback(decks);
        }
    );
}

// Get all groups that contain a user
function groupsWithUser(userID, callback) {

    // MySQL query
    db.query('SELECT DISTINCT groupID FROM `group_members` WHERE userID = ' + mysql.escape(userID) + ';', 
        function (err, results) {
            if(err) throw err;

            // Pack array of data
            let users = [];
            for(let i = 0; i < results.length; i++){
                users.push(results[i].groupID);
            }

            // Send callback after completion
            callback(users);
        }
    );
}

// Convert userID to user name
function userWithID(userID, callback) {

    // MySQL query
    db.query('SELECT userName FROM `group_members` WHERE userID = ' + mysql.escape(userID) + ' LIMIT 1;', 
        function (err, results) {
            if(err) throw err;

            // Send callback after completion
            callback(results[0].userName);
        }
    );
}

// Convert groupID to group name
function groupWithID(groupID, callback) {

    // MySQL query
    db.query('SELECT groupName FROM `group_members` WHERE groupID = ' + mysql.escape(groupID) + ' LIMIT 1;', 
        function (err, results) {
            if(err) throw err;

            // Send callback after completion
            callback(results[0].groupName);
        }
    );
}

exports.usersInGroup = usersInGroup;
exports.decksInGroup = decksInGroup;
exports.groupsWithUser = groupsWithUser;
exports.userWithID = userWithID;
exports.groupWithID = groupWithID;
exports.decksInUser = decksInUser;