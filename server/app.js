require('dotenv').config();

const rating = require('./src/rating');

// Create test players
let testPlayer = new rating.Player(0, 'player', 'me');
let testOpponent = new rating.Player(1, 'opponent', 'me');

// Create record of test players
let results = new rating.MatchResults(
    [new rating.MatchResultSingle(testPlayer, true), 
    new rating.MatchResultSingle(testOpponent, false)]);

// Create a match
results.newMatch(1);
console.log("Match 1 complete");
let results2 = new rating.MatchResults(
    [new rating.MatchResultSingle(testPlayer, false), 
    new rating.MatchResultSingle(testOpponent, true)]);
results2.newMatch(2);
results2.newMatch(3);
results2.newMatch(4);

const ratingList = testPlayer.ratingHistory();
const opponentRatingList = testOpponent.ratingHistory();
for(let i = 0; i < ratingList.length; i++){
    console.log(i + ": " + ratingList[i] + ", " + opponentRatingList[i]);
}