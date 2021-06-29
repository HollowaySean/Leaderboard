// Module requirements
const { query } = require('express');
const express   = require('express');
const router    = express.Router();
const queryDB   = require('../src/queryDB');
router.use(express.json());

// Get deck names from deckID list
router.get('/names', async (req, res) => {
    try {

        // Search userID in database
        queryDB.deckWithID(req.query.deckID, (queryResult) => {

            // Return list of user names
            res.status(200).json(queryResult);
        })

    } catch {
        res.status(500).send();
    }
});

// Create new deck
router.post('/create', async (req, res) => {
    try {

        // Search userID in database
        queryDB.createDeck(req.body.deckName, req.body.userID, async (queryResult) => {
            
            // Return list of user names
            res.status(201).json({
                deckID      : queryResult.insertID,
                deckName    : req.body.deckName,
                userID      : req.body.userID
            });
        })

    } catch {
        res.status(500).send();
    }
});

module.exports = router;