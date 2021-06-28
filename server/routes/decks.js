// Module requirements
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

module.exports = router;