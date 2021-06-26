// Module requirements
const express   = require('express');
const router    = express.Router();
const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');
const queryDB   = require('../src/queryDB');
router.use(express.json());

const users = [];

// Create a new user
router.post('/create', async (req, res) => {
    try {

        // Check if username exists in database
        queryDB.getUserByName(req.body.name.toLowerCase(), async (queryResult) => {
            
            // Generate hash for password
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            // Add username and hash to database
            if(queryResult.length == 0){

                queryDB.createUser(req.body.name.toLowerCase(), hashedPassword);
                res.status(201).send('New user created');
            } else {

                res.status(409).send('User already exists');
            }
        });
    } catch {

        res.status(500).send();
    }
});

// Validate login
router.post('/login', async (req, res) => {
    
    // Search for username in database
    queryDB.getUserByName(req.body.name.toLowerCase(), async (queryResult) => {

        console.log(queryResult[0]);

        // Check if username exists
        if(queryResult.length == 0) {

            res.status(400).send('Username not found');
        } else {

            // Check password
            try {
                if(await bcrypt.compare(req.body.password, queryResult[0].hash.toString())) {

                    res.status(200).send('Login successful, userID: ' + queryResult[0].userID);
                }else{

                    res.status(401).send('Incorrect password');
                }
            } catch {

                res.status(500).send();
            }
        }
    });
})

module.exports = router;