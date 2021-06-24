require('dotenv').config();

const rating = require('./src/rating');

// Create test players
let testPlayer = new rating.Player(0, 0, 'player', 'me');
let testOpponent = new rating.Player(1, 0, 'opponent', 'me');

// Create player test group
let testGroup = new rating.Group([testPlayer, testOpponent]);

// Create record of test players
let results = new rating.MatchResults(
    [new rating.MatchResultSingle(testPlayer, true), 
    new rating.MatchResultSingle(testOpponent, false)]);

// Create a match
results.newMatch(1);
console.log("Match 1 complete");
results = new rating.MatchResults(
    [new rating.MatchResultSingle(testPlayer, false), 
    new rating.MatchResultSingle(testOpponent, true)]);
results.newMatch(2);
results.newMatch(3);
results.newMatch(4);

const ratingList = testPlayer.ratingHistory();
const opponentRatingList = testOpponent.ratingHistory();
for(let i = 0; i < ratingList.length; i++){
    console.log(i + ": " + ratingList[i] + ", " + opponentRatingList[i]);
}

console.log("Group ranking:");
let rankedList = testGroup.sortPlayers();
for(let i = 0; i < rankedList.length; i++){
    console.log(i+1 + ": " + rankedList[i].rating);
}
/*
*/