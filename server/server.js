require('dotenv').config();

const express = require('express');

const app = express();

const ratingDB = require('./src/ratingDB');

ratingDB.usersInGroup(0, (results) => console.log(results));