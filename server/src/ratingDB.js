
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

// Get all groups that contain a user


exports.usersInGroup = usersInGroup;