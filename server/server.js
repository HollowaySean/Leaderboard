require('dotenv').config();

const express = require('express');
const { Result } = require('./src/queryDB');
const app = express();

const ratingDB = require('./src/queryDB');

ratingDB.getHistory(1, (res) => console.log(res.deckIDList));