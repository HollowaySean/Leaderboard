require('dotenv').config();

const express = require('express');
const { Result } = require('./src/queryDB');

const app = express();

const ratingDB = require('./src/queryDB');

ratingDB.getLeaderboard(1, (results) => console.log(results));