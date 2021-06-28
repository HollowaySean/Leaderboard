
//// SETUP ////

// Constants
const minPlayers = 2;
const maxPlayers = 6;

// Connect to database
const mysql = require('mysql');
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});
db.connect();


//// SELECT FUNCTIONS ////

// Get user by name
function getUserByName(userName, callback) {

    // MySQL query
    db.query('SELECT * FROM `users` WHERE userName = ' + mysql.escape(userName) + ' LIMIT 1;', 
        function (err, results) {
            if(err) throw err;

            // NOTE: This function was written after the point when I realized
            //      that I should have embraced JSON from the beginning, so does 
            //      not match the other functions in format.

            // Send callback after completion
            callback(results);
        }
    );
}


// Get all users in group
function usersInGroup(groupID, callback) {

    // MySQL query
    db.query('SELECT userID FROM `groupMembers` WHERE groupID = ' + mysql.escape(groupID) + ';', 
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
    db.query('SELECT deckID FROM `groupDecks` WHERE groupID = ' + mysql.escape(groupID) + ';', 
        function (err, results) {
            if(err) throw err;

            // Pack array of data
            let decks = [];
            for(let i = 0; i < results.length; i++){
                decks.push(results[i].deckID);
            }

            // Send callback after completion
            callback(decks);
        }
    );
}

// Get all decks in group
function decksInUser(userID, callback) {

    // MySQL query
    db.query('SELECT deckID FROM `decks` WHERE userID = ' + userID + ';', 
        function (err, results) {
            if(err) throw err;

            // Pack array of data
            let decks = [];
            for(let i = 0; i < results.length; i++){
                decks.push(results[i].deckID);
            }

            // Send callback after completion
            callback(decks);
        }
    );
}

// Get all groups that contain a user
function groupsWithUser(userID, callback) {

    // MySQL query
    db.query('SELECT DISTINCT groupID FROM `groupMembers` WHERE userID = ' + userID + ';', 
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
    db.query('SELECT userID, userName FROM `users` WHERE userID IN (' + userID + ');', 
        function (err, results) {
            if(err) throw err;

            // Pack array of data
            let users = [];
            for(let i = 0; i < results.length; i++){
                users.push(results[i].userName);
            }

            // Send callback after completion
            callback(users);
        }
    );
}

// Convert groupID to group name
function groupWithID(groupID, callback) {

    // MySQL query
    db.query('SELECT groupID, groupName, inviteCode FROM `groups` WHERE groupID IN (' + groupID + ');', 
        function (err, results) {
            if(err) throw err;

            // Send callback after completion
            callback(results);
        }
    );
}

// Convert invite code to groupID and name
function groupWithInviteCode(inviteCode, callback) {

    // MySQL query
    db.query(`SELECT groupID, groupName FROM groups WHERE inviteCode = ` 
        + mysql.escape(inviteCode) + ` LIMIT 1;`, 
        function (err, results) {
            if(err) throw err;

            // Send callback after completion
            callback(results);
        }
    );
}

// Convert deckID to deck name
function deckWithID(deckID, callback) {

    // MySQL query
    db.query('SELECT deckID, deckName FROM `decks` WHERE deckID IN (' + deckID + ');', 
        function (err, results) {
            if(err) throw err;

            // Send callback after completion
            callback(results);
        }
    );
}

// Class for single deck leaderboard information
class DeckInfo {

    // Class constructor
    constructor(userID, groupID, deckID, mu, sigma) {
        this.userID     = userID;
        this.groupID    = groupID;
        this.deckID     = deckID;
        this.mu         = mu;
        this.sigma      = sigma;
        this.isWinner   = false; // Used for extension to Elo module
    }

    // Rating property
    get rating() { return this.mu - 3*this.sigma; }
}

// Class for leaderboard information
class GroupDeckInfo {

    // Class constructor
    constructor(deckList) {
        if(deckList != null) {
            this.addDeck(deckList);
        }
    }

    // Add deckinfo to deck list
    addDeck(newDeck) {
        if(this.deckList == null) {
            this.deckList = [newDeck];
        }else{
            this.deckList.push(newDeck);
        }
    }

    // Sort list of players by rank
    sortByRating() {
        return this.deckList.sort(this.compareByRating);
    }

    // Compare function for sorting
    compareByRating(a, b) {
        return (a.rating > b.rating) ? -1 : 1;
    }
}

// Get leaderboard
function getLeaderboard(groupID, callback) {

    // MySQL query
    db.query('SELECT * FROM `groupDecks` WHERE groupID = ' + mysql.escape(groupID) + ';', 
        function (err, results) {
            if(err) throw err;

            // Pack class of leaderboard data
            let leaderboard = new GroupDeckInfo();
            for(let i = 0; i < results.length; i++){
                leaderboard.addDeck(new DeckInfo(
                    results[i].userID, 
                    groupID,
                    results[i].deckID, 
                    results[i].mu,
                    results[i].sigma)
                );
            }
            // Send callback after completion
            callback(leaderboard);
        });
}

// Get single deck information
function getDeckInfo(groupID, deckID, callback) {

    // MySQL query
    db.query('SELECT * FROM groupDecks WHERE groupID = ' + groupID + ' AND deckID IN (' + deckID + ');', 
        function (err, results) {
            if(err) throw err;

            // Pack class of leaderboard data
            let deckInfoList = [];
            for(let i = 0; i < results.length; i++) {
                deckInfoList.push(new DeckInfo(
                    results[i].userID, 
                    groupID,
                    deckID[i], 
                    results[i].mu,
                    results[i].sigma
                ));
            }
            // Send callback after completion
            callback(deckInfoList);
        });
}

// Class for single match information
class MatchInfo {

    // Class constructor
    constructor(matchNum, deckID, newRating) {
        this.matchNum   = matchNum;
        this.deckID     = deckID;
        this.rating     = newRating;
    }
}

class GroupMatchInfo {

    // Class constructor
    constructor(matchList) {
        if(matchList != null) {
            this.addMatch(matchList);
        }
        this.deckIDList = [];
    }

    // Add matchinfo to match list
    addMatch(newMatch) {
        if(this.matchList == null) {
            this.matchList = [newMatch];
        }else{
            this.matchList.push(newMatch);
        }
    }

    // Generate 2D array of rating histories
    //TODO
}

// Get statistic audit history
function getAudit(groupID, callback) {

    // MySQL query
    db.query('SELECT * FROM groupRecords WHERE groupID = ' + groupID + '; ', 
        function (err, results) {
            if(err) throw err;

            // Pack class of leaderboard data
            let history = new GroupMatchInfo();
            let deckIDList = [];
            for(let i = 0; i < results.length; i++){
                history.addMatch(new MatchInfo(
                    results[i].matchNum, 
                    results[i].deckID, 
                    results[i].newRating)
                );
                deckIDList.push(results[i].deckID);
            }
            history.deckIDList = [...new Set(deckIDList)];

            // Send callback after completion
            callback(history);
        });
}

// Get match history
function getHistory(groupID, callback) {

    // MySQL query
    db.query('SELECT * FROM groupMatches WHERE groupID = ' + groupID + '; ', 
        function (err, results) {
            if(err) throw err;

            callback(results);
            // // Pack class of leaderboard data
            // let history = new GroupMatchInfo();
            // let deckIDList = [];
            // for(let i = 0; i < results.length; i++){
            //     history.addMatch(new MatchInfo(
            //         results[i].matchNum, 
            //         results[i].deckID, 
            //         results[i].newRating)
            //     );
            //     deckIDList.push(results[i].deckID);
            // }
            // history.deckIDList = [...new Set(deckIDList)];

            // // Send callback after completion
            // callback(history);
        });
}

// Get match number
function getLastMatchNum(groupID, callback) {

    // MySQL query
    db.query('SELECT MAX(matchNum) AS maxNum FROM `groupMatches` WHERE groupID = ' + mysql.escape(groupID) + ';', 
        function (err, results) {
            if(err) throw err;

            // Send callback after completion
            callback(results[0].maxNum);
        });
}

//// INSERT FUNCTIONS ////

// Create new user
function createUser(userName, hash) {
    db.query('INSERT IGNORE INTO users (userName, hash) VALUES (' + mysql.escape(userName) + ', ' + mysql.escape(hash) + ');');
}

// Create new group
function createGroup(groupName, inviteCode, callback) {

    // MySQL query
    db.query(
        `INSERT IGNORE INTO groups (groupName, inviteCode) VALUES
        (` + mysql.escape(groupName) + ', ' + mysql.escape(inviteCode) + `);`, 
        (err, results) => {
            if(err) throw err;

            // Return groupID after insert
            db.query(`SELECT MAX(groupID) AS groupID FROM groups;`, (err, results) => {
                callback(results);
            });
        });
}

// Create new deck
function createDeck(deckName, userID) {
    db.query(
        `INSERT IGNORE INTO decks (deckName, userID) VALUES 
        (` + mysql.escape(deckName) + ', ' + mysql.escape(userID) + `);`, 
        (err, results) => {
            if(err) throw err;

            // Return groupID after insert
            db.query(`SELECT MAX(groupID) AS groupID FROM groups;`, (err, results) => {
                callback(results);
            });
        });
}

// Add user to group
function addUserToGroup(groupID, userID) {
    db.query('INSERT IGNORE INTO groupMembers (groupID, userID) VALUES (' + mysql.escape(groupID) + ', ' + mysql.escape(userID) + ');');
}

// Add deck to group
function addDeckToGroup(groupID, userID, deckID) {
    db.query('INSERT IGNORE INTO groupDecks (groupID, userID, deckID) VALUES (' + mysql.escape(groupID) + ', ' + mysql.escape(userID) + ', ' + mysql.escape(deckID) + ');');
}

// Class for match result
class Result {

    constructor(deckID, isWinner) {
        this.deckID     = deckID;
        this.isWinner   = isWinner;
    };

    static fromDeckInfo(deckInfo) {
        this.deckID     = deckInfo.deckID;
        this.isWinner   = deckInfo.isWinner;
    }

    static get NullResult() {
        return new Result('NULL', 'NULL');
    }
}

// Create new match
function createMatch(groupID, matchNum, resultList) {

    // Pad lists to correct length
    if(resultList.length < minPlayers) {
        throw new Error("Not enough decks to create match");
    }else if(resultList.length > maxPlayers) {
        throw new Error("Number of players in match exceeds maximum");
    }
    while(resultList.length < maxPlayers) {
        resultList.push(Result.NullResult);
    }

    // Format results into query
    columnStr = [];
    valueStr = [];
    for(let i = 0; i < maxPlayers; i++) {
        columnStr += ', deck' + (i+1) + ', isWinner' + (i+1);
        valueStr += ', ' + resultList[i].deckID + ', ' + resultList[i].isWinner;
    }

    // MySQL query
    db.query('INSERT IGNORE INTO groupMatches (groupID, matchNum' + columnStr + ') VALUES (' + mysql.escape(groupID) + ', ' + mysql.escape(matchNum) + valueStr + ');');
}

// Create new record
function createRecord(groupID, matchNum, deckID, newRating) {
    db.query('INSERT IGNORE INTO groupRecords (groupID, matchNum, deckID, newRating) VALUES (' + mysql.escape(groupID) + ', ' + mysql.escape(matchNum) + ', ' + mysql.escape(deckID) + ', ' + mysql.escape(newRating) + ');');
}

//// UPDATE FUNCTIONS ////

// Change elo rating values of deck
function updateDeck(groupID, deckID, newMu, newSigma) {
    db.query('UPDATE groupDecks SET mu = ' + newMu + ', sigma = ' + newSigma + ' WHERE deckID = ' + deckID + ' AND groupID = ' + groupID + ';')
}

//// ELO SYSTEM HELPER FUNCTIONS ////
// These functions bridge the gap between my old Elo library and the new database system
const elo = require('./elo');

// Perform a match using deckInfo list 
function matchUpdateDecks(deckInfoList, matchNumber) {

    // Convert deck info list into match results structure from elo library
    let matchResults = new elo.MatchResults();
    for(let i = 0; i < deckInfoList.length; i++) {
        matchResults.addResult(new elo.MatchResultSingle(deckInfoList[i], deckInfoList[i].isWinner));
    }

    // Update deck info list using elo library
    matchResults.newMatch(matchNumber);

    // Return deck info list in original format
    return deckInfoList;
}


// Exports
module.exports = {
    getUserByName    : getUserByName,
    usersInGroup     : usersInGroup,
    decksInGroup     : decksInGroup,
    decksInUser      : decksInUser,
    groupsWithUser   : groupsWithUser,
    userWithID       : userWithID,
    groupWithID      : groupWithID,
    groupWithCode    : groupWithInviteCode,
    deckWithID       : deckWithID,
    DeckInfo         : DeckInfo,
    GroupDeckInfo    : GroupDeckInfo,
    getLeaderboard   : getLeaderboard,
    getDeckInfo      : getDeckInfo,
    MatchInfo        : MatchInfo,
    GroupMatchInfo   : GroupMatchInfo,
    getAudit         : getAudit,
    getHistory       : getHistory,
    getLastMatchNum  : getLastMatchNum,
    createUser       : createUser,
    createGroup      : createGroup,
    createDeck       : createDeck,
    addUserToGroup   : addUserToGroup,
    addDeckToGroup   : addDeckToGroup,
    Result           : Result,
    createMatch      : createMatch,
    createRecord     : createRecord,
    updateDeck       : updateDeck,
    matchUpdateDecks : matchUpdateDecks
}
