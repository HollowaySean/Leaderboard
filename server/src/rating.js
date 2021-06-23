
// Class to represent single match record
class Match {
    
    // Class constructor
    constructor(matchNumber, newMu, newSigma) {
        this.matchNumber    = matchNumber;
        this.mu             = newMu;
        this.sigma          = newSigma;
    }

    // Default class constructor
    static defaultMatch() {
        return new Match(0, 25, 25/3);
    }

    // Elo skill rating
    get rating() { return this.mu - 3*this.sigma; }
}

// Class to represent single player's match history
class Player {

    // Class constructor
    constructor(id, name, owner){

        this.id     = id;
        this.name   = name;
        this.owner  = owner;

        this.matchHistory = [];
        this.matchHistory.push(Match.defaultMatch());
    }

    // Get most recent match
    get currentMatch() { return this.matchHistory[this.matchHistory.length - 1]; }

    // Add new match to history
    addMatch(matchNumber, newMu, newSigma) {

        // Ignore if match added out of order
        if(matchNumber > this.currentMatch.matchNumber){
            this.matchHistory.push(new Match(matchNumber, newMu, newSigma));
        }else{
            throw new Error("Match added after most recent match! Examine code for fault.");
        }
    }

    // Elo skill curve properties
    get mu()        { return this.currentMatch.mu; }
    get sigma()     { return this.currentMatch.sigma; }
    get rating()    { return this.mu - 3 * this.sigma; }

    // Return rating history over all matches
    ratingHistory(finalMatch = this.currentMatch.matchNumber) {

        // Initialize variables
        const history = [];
        let index = 0;
        let currentRating = 0;

        // Add rating for each match number
        for(let match = 0; match <= finalMatch; match++){

            // Check if match history includes this match number
            if(index > this.matchHistory.length || this.matchHistory[index].matchNumber == match){
                currentRating = this.matchHistory[index].rating;
                index++;
            }
            history.push(currentRating);
        }
        return history;
    }
}

// Class holding a player's current rating
class Standing {

    // Class constructor
    constructor(player, rating) {
        this.player = player;
        this.rating = rating;
    }
}

// Class holding a player's result from a match
class MatchResult {

    // Class constructor
    constructor(player, result) {
        this.player = player;
        this.result = result;
    }
}



// Export module methods
exports.Player = Player;
