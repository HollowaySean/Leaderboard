// Module requirements
const express   = require('express');
const router    = express.Router();
const queryDB   = require('../src/queryDB');
const elo       = require('../src/elo');
router.use(express.json());

// Create a new group
router.post('/create', async (req, res) => {

    // Generate invite code for group
    let inviteCode = '';
    for(let i = 0; i < 5; i++) {
        let newCharCode = Math.floor(Math.random() * 26) + 65;
        inviteCode += String.fromCharCode(newCharCode);
    }

    // Set up data to be pushed to database
    let keysValues = req.body;
    keysValues.inviteCode = inviteCode;

    // Query database
    queryDB.insertFetchGeneric(req.body, res, 'groups', 'groupID');
});

// Add user to group
router.post('/adduser', async (req, res) => {
    try {

        // Find group info by invite code
        queryDB.getGeneric('groups', 'inviteCode', req.body.inviteCode, async (err, results) => {

            // If match is not found, return error code
            if(results.rows.length === 0) {

                res.status(400).send('Invalid invite code.');
            } else {

                let groupID = results.rows[0].groupID;

                // Check if user is already in group
                queryDB.getGeneric('groupMembers', 'userID', req.body.userID, async (err, results) => {

                    // If already in group, return error code
                    if(results.rows.find(element => element.groupID === groupID)) {

                        res.status(409).send('User already in group.');
                    } else {

                        // Query database
                        let keysValues = { userID : req.body.userID, groupID : groupID };
                        queryDB.insertFetchGeneric(keysValues, res, 'groupMembers', null);
                    }
                });
            }
        });
    } catch { res.status(500).send(); }
});

// Add deck to group
router.post('/adddeck', async (req, res) => {

    // Check if deck is already in group
    queryDB.getGeneric('groupDecks', 'groupID', req.body.groupID, async(err, results) => {

        // If already in group, return error code
        if(results.rows.find(element => element.deckID === req.body.deckID)) {

            res.status(400).send('Deck already in group.');
        } else {

            // Query database
            queryDB.insertFetchGeneric(req.body, res, 'groupDecks', null);
        }
    });
});

// Get group info by id
router.get('/info', async (req, res) => {
    queryDB.getFetchGeneric(req, res, 'groups', 'groupID')
});

// Get list of users in group
router.get('/users', async (req, res) => {
    queryDB.getFetchGeneric(req, res, 'groupMembers', 'groupID')
});


// Get list of decks in group
router.get('/decks', async (req, res) => {
    queryDB.getFetchGeneric(req, res, 'groupDecks', 'groupID')
});

// Get group statistic history
router.get('/audit', async (req, res) => {
    queryDB.getFetchGeneric(req, res, 'groupRecords', 'groupID');
});

// Get group match history
router.get('/history', async (req, res) => {
    queryDB.getFetchGeneric(req, res, 'groupMatches', 'groupID');
});

// Get most recent match number
router.get('/lastmatch', async (req, res) => {
    queryDB.getFetchMax(req, res, 'groupMatches', 'groupID', 'matchNum');
});

// Add and process new match
router.post('/newmatch', async(req, res) => {
    try {

        // Update statistics using Elo rating system
        req.body.results = elo.matchUpdate(req.body.results);

        // Add match to database
        createMatchRecord(req.body)
        .then(createAuditRecord(req.body))

        // Return modified body
        .then(res.status(201).json(req.body));
    
    } catch { res.status(500).send(); }

});

// Function to make calls to record audit info
async function createAuditRecord(body) {

    // Loop asynchronously through list
    // (Note: is asynchrony necessary?)
    let iteration = 0;
    let insertSingle = async (data, iteration) => {

        if(iteration < data.length) {

            // Query database to add single deck record
            queryDB.insertGeneric('groupRecords', data[iteration], (err, results) => {
                if(err) throw err;

                // Call next item in list after completion
                insertSingle(data, iteration+1)
            });
        }
    }

    // Prepare data for use
    let auditData = body.results.map(player => {
        return {
            matchNum    : body.matchNum,
            groupID     : body.groupID,
            deckID      : player.deckID,
            newRating   : player.newRating
        }
    });

    // Call first iteration
    insertSingle(auditData, 0);
}

// Function to make calls to record match info
async function createMatchRecord(body) {

    // Prepare data for pass into database
    let matchData = {
        groupID     : body.groupID,
        matchNum    : body.matchNum
    };
    body.results.forEach((result, index) => {
        matchData['deck' + (index+1)] = result.deckID,
        matchData['isWinner' + (index+1)] = result.isWinner
    });

    // Pass insert query to database
    queryDB.insertGeneric('groupMatches', matchData, (err, results) => {
        if(err) throw err;
    })
}

module.exports = router;