// Module requirements
const express = require('express');
const router = express.Router();
const queryDB = require('../src/queryDB');

router.get('/', (req, res) => {
    res.send('hellow?');
})

router.get('/here/', (req, res) => {
    res.send('hellow part 2');
})

module.exports = router;