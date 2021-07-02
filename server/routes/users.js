// Module requirements
const express   = require('express');
const router    = express.Router();
const bcrypt    = require('bcrypt');
const queryDB   = require('../src/queryDB');
router.use(express.json());

// Get list of groups which contain user
router.get('/names', async (req, res) => { 
    queryDB.getFetchGeneric(req, res, 'users', 'userID');
});

// Get list of decks that user owns
router.get('/decks', async (req, res) => { 
    queryDB.getFetchGeneric(req, res, 'decks', 'userID');
});

// Get list of groups which contain user
router.get('/groups', async (req, res) => { 
    queryDB.getFetchGeneric(req, res, 'groupMembers', 'userID');
});

// Create a new user
router.post('/create', async (req, res) => {
    try {
        // Check if username exists in database
        queryDB.getGeneric('users', 'userName', req.body.userName, async (err, results) => {
            
            // Generate hash for password
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
            // Add username and hash to database
            if(results.rows.length === 0){

                let keysValues = { userName : req.body.userName, hash : hashedPassword}
                queryDB.insertFetchGeneric(keysValues, res, 'users', 'userID');

            } else {
    
                res.status(409).send('User already exists');
            }
        });
    } catch { res.status(500).send(); }
});

// Validate login
router.post('/login', async (req, res) => {
    try {
        // Search for username in database
        queryDB.getGeneric('users', 'userName', req.body.name, async (err, results) => {

            // Check if username exists
            if(results.rows.length == 0) {

                res.status(400).send('Username not found');
            } else {

                // Check password
                if(await bcrypt.compare(req.body.password, results.rows[0].hash.toString())) {

                    res.status(200).json({userID : results.rows[0].userID});
                }else{

                    res.status(401).send('Incorrect password');
                }}});
    } catch { res.status(500).send(); }
});


module.exports = router;