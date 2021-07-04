// Module requirements
const express   = require('express');
const router    = express.Router();
const queryDB   = require('../src/queryDB');
router.use(express.json());

// Get deck names from deckID list
router.get('/names', async (req, res) => { 
    queryDB.getFetchGeneric(req, res, 'decks', 'deckID');
});

// Create new deck
router.post('/create', async (req, res) => {
    try {

        // Check if user already has deck with name
        queryDB.getGeneric('decks', 'userID', req.body.userID, async (err, results) => {

            // If name is unique, insert into database
            if(results.rows.find(element => element.deckName === req.body.deckName)) {

                res.status(409).send('User already has deck with name \'' + req.body.deckName + '\'');
            } else {

                queryDB.insertFetchGeneric(req.body, res, 'decks', 'deckID');
            }
        });

    } catch { res.status(500).send(); }
});

module.exports = router;