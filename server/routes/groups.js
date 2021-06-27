// Module requirements
const express   = require('express');
const { createMatch, matchUpdateDecks } = require('../src/queryDB');
const router    = express.Router();
const queryDB   = require('../src/queryDB');
router.use(express.json());

// Create a new group
router.post('/create', async (req, res) => {
    try {

        // Generate invite code for group
        let inviteCode = '';
        for(let i = 0; i < 5; i++) {
            let newCharCode = Math.floor(Math.random() * 26) + 65;
            inviteCode += String.fromCharCode(newCharCode);
        }
        
        // Create new group and return group info
        queryDB.createGroup(req.body.groupName, inviteCode, 
            (queryResult) => {

                res.status(201).json({ 
                    groupID     : queryResult[0].groupID,
                    groupName   : req.body.groupName,
                    inviteCode  : inviteCode 
                    }).send();
            });
        
    } catch {
        res.status(500).send();
    }
});

// Add user to group with invite code
router.post('/adduser', async (req, res) => {
    
    try {
    
        // Find group info by invite code
        queryDB.groupWithCode(req.body.inviteCode, async (queryResult) => {

            // Check if username exists
            if(queryResult.length == 0) {

                res.status(400).send('Invalid invite code');
            } else {
                
                // Add user to group using code
                queryDB.addUserToGroup(queryResult[0].groupID, req.body.userID);
                res.status(201).json({
                    groupID     : queryResult[0].groupID,
                    groupName   : queryResult[0].groupName
                })
            }
        });

    } catch {
        res.status(500).send();
    }
});

// Add deck to group
router.post('/adddeck', async (req, res) => {
    
    try {
    
        // Add deck to groupDecks database
        queryDB.addDeckToGroup(req.body.groupID, req.body.userID, req.body.deckID);
        res.status(201).send('Deck added to group');

    } catch {
        res.status(500).send();
    }
});

// Get list of users in group
router.get('/users', async (req, res) => {
    try {

        // Search groupID in database
        queryDB.usersInGroup(req.body.groupID, async (queryResult) => {

            // Return list of userID values
            res.status(200).json({ userID : queryResult }).send();
        })

    } catch {
        res.status(500).send();
    }
});

// Get list of decks in group
router.get('/decks', async (req, res) => {
    try {

        // Search groupID in database
        queryDB.decksInGroup(req.body.groupID, async (queryResult) => {

            // Return list of userID values
            res.status(200).json({ deckID : queryResult }).send();
        })

    } catch {
        res.status(500).send();
    }
});

// Get group leaderboard
router.get('/ranking', async (req, res) => {
    try {

        // Search groupID in database
        queryDB.getLeaderboard(req.body.groupID, async (queryResult) => {

            let sortedList = queryResult.sortByRating();
            for(let i = 0; i < sortedList.length; i++) {
                sortedList[i].rank = i+1;
                sortedList[i].rating = sortedList[i].mu - 3*sortedList[i].sigma;
                delete sortedList[i].mu;
                delete sortedList[i].sigma;
                delete sortedList[i].isWinner;
                
            }

            // Return list of deck rating information
            res.status(200).json(sortedList).send();
        })

    } catch {
        res.status(500).send();
    }
});

// Get group statistic history
router.get('/audit', async (req, res) => {
    try {

        // Search groupID in database
        queryDB.getHistory(req.body.groupID, async (queryResult) => {

            // Return audit list of decks and ratings
            res.status(200).json(queryResult).send();
        })

    } catch {
        res.status(500).send();
    }
});

// Get group match history
router.get('/history', async (req, res) => {
    try {

        // Search groupID in database
        queryDB.getHistory(req.body.groupID, async (queryResult) => {

            // Return historical list of matches
            res.status(200).json(queryResult).send();
        })

    } catch {
        res.status(500).send();
    }
});

// Get most recent match number
router.get('/lastmatch', async (req, res) => {
    try {

        // Search groupID in database
        queryDB.getLastMatchNum(req.body.groupID, async (queryResult) => {

            // Return last match number
            res.status(200).json({ matchNum : queryResult }).send();
        })

    } catch {
        res.status(500).send();
    }
});

// Add process new match
router.post('/newmatch', async(req, res) => {
    try {

        // Get DeckInfo objects
        let deckList = req.body.results.map(element => element.deckID);
        queryDB.getDeckInfo(req.body.groupID, deckList, 
            (deckInfoList) => {
                
                // Set isWinner values for resulting decklist
                for(let i = 0; i < deckInfoList.length; i++ ) {
                    deckInfoList[i].isWinner = req.body.results[i].isWinner;
                }

                // Generate new statistics
                deckInfoList = queryDB.matchUpdateDecks(deckInfoList, req.body.matchNum);

                let muList      = deckInfoList.map(element => element.mu);
                let sigmaList   = deckInfoList.map(element => element.sigma);
                let ratingList  = deckInfoList.map(element => (element.mu - 3* element.sigma));

                // Update each deck and add new audit record
                for(let i = 0; i < deckList.length; i++) {
                    queryDB.createRecord(req.body.groupID, req.body.matchNum, deckList[i], ratingList[i]);
                    queryDB.updateDeck(req.body.groupID, deckList[i], muList[i], sigmaList[i]);
                }

                // Add match to list in database
                queryDB.createMatch(req.body.groupID, req.body.matchNum, deckInfoList);

                // If none of those fail, return HTTP code
                res.status(201).send('Match successfully recorded');

            });

    } catch {
        res.status(500).send();
    }
});


module.exports = router;