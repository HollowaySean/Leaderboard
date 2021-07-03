// Elo system updates
const beta      = 25 / 6;
const gamma     = beta / 100;
const epsilon   = 0.0522218;

// Function to take player statistics and generate new match
module.exports.matchUpdate = (resultList) => {

    // Loop through players in results list
    return resultList.map(player => {

        let muStepSq = 0;
        let sigmaStep = 1;

        // Loop through opponents
        resultList.forEach(opponent => {
            
            // Skip self
            if(player === opponent) { return; }

            // If player is a winner, update using all components
            if(player.isWinner) {

                // Update statistics
                muStepSq
                    += muWinnerDelta(
                        player, opponent, opponent.isWinner) ** 2;
                sigmaStep 
                    *= sigmaWinnerCoefficient(
                        player, opponent, opponent.isWinner);

            // If player is not a winner, only update using winner(s)
            } else if(opponent.isWinner) {

                // Update statistics
                muStepSq
                    += muLoserDelta(
                        player, opponent) ** 2;
                sigmaStep
                    *= sigmaLoserCoefficient(
                        player, opponent);
            }
        });

        // Calculate statistic update
        let newMu = 
            player.mu + Math.sqrt(muStepSq) * (player.isWinner ? 1 : -1);
        
        let newSigma = 
            player.sigma * Math.sqrt(sigmaStep**2 + gamma**2);

        let newRating = Math.floor(100 * (newMu - 3*newSigma));

        // Return updated object
        let newPlayer = player;
        newPlayer.mu = newMu;
        newPlayer.sigma = newSigma;
        newPlayer.newRating = newRating;
        return newPlayer;
    });
}


// Function to update mean of winner
function muWinnerDelta(winner, loser, isDraw) { 
    let c = 2 * (beta**2) + (winner.sigma**2) + (loser.sigma**2);
    let muDelta = ((winner.sigma**2 + gamma**2) / c) *
        vFunction((winner.mu - loser.mu) / c, epsilon / c, isDraw);
    return muDelta;
}
// Function to update mean of loser
function muLoserDelta(winner, loser) { 
    let c = 2 * (beta**2) + (winner.sigma**2) + (loser.sigma**2);
    let muDelta = ((winner.sigma**2 + gamma**2) / c) *
        vFunction((winner.mu - loser.mu) / c, epsilon / c, false);
    return muDelta;

}
// Function to update variance of winner
function sigmaWinnerCoefficient(winner, loser, isDraw) {
    let c = 2 * (beta**2) + (winner.sigma**2) + (loser.sigma**2);
    let sigmaCoeff = Math.sqrt(1 - ((winner.sigma**2 + gamma**2) / (c**2)) *
        wFunction((winner.mu - loser.mu) / c, epsilon / c, isDraw));
    return sigmaCoeff;
}
// Function to update variance of loser
function sigmaLoserCoefficient(winner, loser) {
    let c = 2 * (beta**2) + (winner.sigma**2) + (loser.sigma**2);
    let sigmaCoeff = Math.sqrt(1 - ((loser.sigma**2 + gamma**2) / (c**2)) *
        wFunction((winner.mu - loser.mu) / c, epsilon / c, false));
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