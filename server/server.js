require('dotenv').config();

const express = require('express');

const app = express();

const ratingDB = require('./src/ratingDB');

ratingDB.usersInGroup(1, (results) => console.log(results));
ratingDB.decksInGroup(0, (results) => console.log(results));
ratingDB.decksInUser(0, (results) => console.log(results));
ratingDB.groupsWithUser('sean', (results) => console.log(results));
ratingDB.userWithID(1, (results) => console.log(results));
ratingDB.groupWithID(1, (results) => console.log(results));