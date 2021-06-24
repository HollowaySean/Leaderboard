// Elo system updates
const beta      = 25 / 6;
const gamma     = beta / 100;
const epsilon   = 0.0522218;

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

// Class holding a player's current rating (Delete?)
class Standing {

    // Class constructor
    constructor(player, rating) {
        this.player = player;
        this.rating = rating;
    }
}

// Class holding a player's result from a match
class MatchResultSingle {

    // Class constructor
    constructor(player, result) {
        this.player     = player;
        this.muInit     = player.mu;
        this.muStepSq   = 0;
        this.sigmaInit  = player.sigma;
        this.sigmaStep  = 1;
        this.winner     = result;
    }

    // Function to update player histories
    updateHistory(matchNumber) {

        let newMu = this.muInit + Math.sqrt(this.muStepSq) * (this.winner ? 1 : -1);
        let newSigma = this.sigmaStep * Math.sqrt(this.sigmaInit**2 + gamma**2);
        
        // console.log("Is winner? " + this.winner);
        // console.log("Mu Before: " + this.muInit + "\nAfter: " + newMu + "\nStep: " + this.muStepSq);
        // console.log("Sig Before: " + this.sigmaInit + ", After: " + newSigma + "\nStep: " + this.sigmaStep);
        this.player.addMatch(matchNumber, newMu, newSigma);
    }
}

// Class holding all player's results from a match
class MatchResults {

    // Class constructor
    constructor(resultArray=[]) {
        this.results = resultArray;
    }

    // Add single result
    addResult(newResult) {
        this.results.push(newResult);
    }

    // Add array of results
    addResultArray(newResult) {
        this.results.push(...newResult);
    }

    // Get array of results
    get resultArray() { return this.results; }

    // Function to update all players in a match
    newMatch(matchNumber) {

        // Loop through players in match result
        this.resultArray.forEach(player => {
            
            // Loop through all other players
            this.resultArray.forEach(opponent => {

                // Skip self
                if(player == opponent) { return; }

                // If player is a winner, update using all opponents
                if(player.winner) {

                    // Determine if draw occurred
                    let isDraw = opponent.winner;

                    // Update mean and variance
                    player.muStepSq       += muWinnerDelta(player, opponent, isDraw) ** 2;
                    player.sigmaStep    *= sigmaWinnerCoefficient(player, opponent, isDraw);

                } else if(opponent.winner) {

                    // Update mean and variance
                    player.muStepSq       += muLoserDelta(player, opponent) ** 2;
                    player.sigmaStep    *= sigmaLoserCoefficient(player, opponent);
                }
            });

            // Update each player's ratings
            player.updateHistory(matchNumber);    
        });
    }
}

// Function to update mean of winner
function muWinnerDelta(winner, loser, isDraw) { 
    let c = 2 * (beta**2) + (winner.sigmaInit**2) + (loser.sigmaInit**2);
    let muDelta = ((winner.sigmaInit**2 + gamma**2) / c) *
        vFunction((winner.muInit - loser.muInit) / c, epsilon / c, isDraw);
    return muDelta;
}
// Function to update mean of loser
function muLoserDelta(winner, loser) { 
    let c = 2 * (beta**2) + (winner.sigmaInit**2) + (loser.sigmaInit**2);
    let muDelta = -1 * ((winner.sigmaInit**2 + gamma**2) / c) *
        vFunction((winner.muInit - loser.muInit) / c, epsilon / c, false);
    return muDelta;

}
// Function to update variance of winner
function sigmaWinnerCoefficient(winner, loser, isDraw) {
    let c = 2 * (beta**2) + (winner.sigmaInit**2) + (loser.sigmaInit**2);
    let sigmaCoeff = Math.sqrt(1 - ((winner.sigmaInit**2 + gamma**2) / (c**2)) *
        wFunction((winner.muInit - loser.muInit) / c, epsilon / c, isDraw));
    return sigmaCoeff;
}
// Function to update variance of loser
function sigmaLoserCoefficient(winner, loser) {
    let c = 2 * (beta**2) + (winner.sigmaInit**2) + (loser.sigmaInit**2);
    let sigmaCoeff = Math.sqrt(1 - ((loser.sigmaInit**2 + gamma**2) / (c**2)) *
        wFunction((winner.muInit - loser.muInit) / c, epsilon / c, false));
    return sigmaCoeff;
}

// Gaussian function
function gaussianFunction(x, mu = 0, sigma = 1) {
    let y = Math.exp(-0.5 * ((x - mu)**2) / (sigma ** 2)) / (sigma * Math.sqrt(2 * Math.PI));
    return y;
}
// Gaussian error function
function errorFunction(x) {

    // Error function approximation credited to Abramowitz & Stegun
    // Code snippet thanks to user "ptmalcolm" on stackoverflow

    var z;
    const ERF_A = 0.147; 
    var the_sign_of_x;
    if(0==x) {
        the_sign_of_x = 0;
        return 0;
    } else if(x>0){
        the_sign_of_x = 1;
    } else {
        the_sign_of_x = -1;
    }

    var one_plus_axsqrd = 1 + ERF_A * x * x;
    var four_ovr_pi_etc = 4/Math.PI + ERF_A * x * x;
    var ratio = four_ovr_pi_etc / one_plus_axsqrd;
    ratio *= x * -x;
    var expofun = Math.exp(ratio);
    var radical = Math.sqrt(1-expofun);
    z = radical * the_sign_of_x;
    return z;
}
// Theta function, the CDF of the Gaussian function
function thetaFunction(x) {
    let z = 0.5 * (1 + errorFunction(x / Math.sqrt(2)));
    return z;
}
// V Function, the Bayesian update function for mean of Gaussian distributions
function vFunction(t, eta, isDraw) {
    
    let y = 0;
    if(isDraw) {

        if(Math.abs(t - eta) > 5) {
            y = Math.abs(t - eta);
        }else{
            y = gaussianFunction(t - eta) / thetaFunction(t - eta);
        }

    }else{

        if(t - eta < -5) {
            y = eta - t;
        }else{
            y = gaussianFunction(t - eta) / thetaFunction(t - eta);
        }
    }
    return y;
}
// W Function, the Bayesian update function for variance of Gaussian distributions
function wFunction(t, eta, isDraw) {

    let y = 0;
    if(isDraw) {

        if(Math.abs(t - eta) > 4) {
            y = 1;
        }else{
            y = (vFunction(t, eta, isDraw)**2) + 
                (((eta - t) * gaussianFunction(eta - t) + (eta + t) * gaussianFunction(eta + t)) /
                (thetaFunction(eta - t) - thetaFunction(-eta - t)));
        }
    } else {

        if(t - eta < -4) {
            y = 1;
        }else{
            y = vFunction(t, eta, isDraw) *
                (vFunction(t, eta, isDraw) + t - eta);
        }
    }
    return y;
}


// Export module methods
exports.Player = Player;
exports.MatchResults = MatchResults;
exports.MatchResultSingle = MatchResultSingle;
