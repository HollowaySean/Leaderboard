// Module requirements
const express   = require('express');
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



module.exports = router;