require('dotenv').config();

const rating = require('./src/rating');
let testPlayer = new rating.Player(0, 'test', 'me');

testPlayer.addMatch(1, 1, 2);
testPlayer.addMatch(8, -4, 6);
testPlayer.addMatch(10, -9, 6);

const ratingList = testPlayer.ratingHistory();
console.log(ratingList.length);

for(let i = 0; i < ratingList.length; i++){
    console.log(i + ": " + ratingList[i]);
}