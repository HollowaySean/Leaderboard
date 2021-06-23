using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RatingSystem
{

    // TODO: IMPLEMENT USE OF GAMMA

    // System wide variables
    public static float beta = (25f / 6f) * 1f;
    public static float gamma = (beta / 100f) * 1f;
     public static float epsilon = 0.0522218f;
    // NOTE: Calculated from draw probability of 1/200, beta, and assuming 4 players
    public enum ResultType { Draw, NonDraw };

    // Class for individual player
    [System.Serializable]
    public class Player {
        // Variables
        private string _builder;
        private string _commander;
        private List<int> _matchHistory;
        public string Name {
            get { return _builder + "'s " + _commander; }
        }

        private List<float> _mu;
        public float Mu {
            get { return _mu[_mu.Count - 1]; }
        }

        private List<float> _sigma;
        public float Sigma {
            get { return _sigma[_sigma.Count - 1]; }
        }

        // Derived variables
        public float Rating {
            get { return (Mu - 3 * Sigma); }
        }
        public float Pi {
            get { return 1 / (Sigma * Sigma); }
        }
        public float Tau {
            get { return (Pi * Mu); }
        }
        public float SigmaWithDynamics {
            get { return Mathf.Sqrt(Sigma * Sigma + gamma * gamma); }
        }

        // Constructor
        public Player(string builder = "Stranger", string commander = "Untitled") {
            _builder = builder;
            _commander = commander;
            _mu = new List<float> { 25f };
            _sigma = new List<float> { 25f / 3f };
            _matchHistory = new List<int>();
        }

        // Methods
        public void Rename(string builder, string commander) {
            _builder = builder;
            _commander = commander;
        }

        public void Update(float newMu, float newSigma, int matchNumber) {

            // Check to make sure this match isn't outdated
            bool validMatch;
            if (_matchHistory.Count == 0) {
                validMatch = true;
            } else {
                validMatch = (matchNumber > _matchHistory[_matchHistory.Count - 1]);
            }

            if (validMatch) {

                // Update the player's standings
                _mu.Add(newMu);
                _sigma.Add(newSigma);
                _matchHistory.Add(matchNumber);

            } else {
                throw new System.ArgumentException("Match number is older than the newest match in player history");
            }
        }
    }

    public static int SortByRating(Player p1, Player p2) {

        // Sort delegate for list sorting
        return -p1.Rating.CompareTo(p2.Rating);
    }

    // Method to update player rankings after a match
    public static void Match(Dictionary<Player, bool> standings, int matchNumber) {

        Dictionary<Player, float> muUpdate = new Dictionary<Player, float>();
        Dictionary<Player, float> sigmaUpdate = new Dictionary<Player, float>();

        // Update for each contestant
        foreach (Player player in standings.Keys) {

            muUpdate.Add(player, 0);
            sigmaUpdate.Add(player, 1);

            // Loop through opponents
            foreach (Player opponent in standings.Keys) {

                // Skip opponent if refers to player
                if (player == opponent) { continue; } else {

                    // If player is a winner, update using all opponents
                    if (standings[player]) {

                        // Determine if draw occurred
                        ResultType resultType = standings[opponent] ? ResultType.Draw : ResultType.NonDraw;

                        // Add change in mu to running delta
                        muUpdate[player] += Mathf.Pow(MuWinnerDelta(player.Mu, player.Sigma, opponent.Mu, opponent.Sigma, resultType), 2);

                        // Multiply change in sigma to running coefficient
                        sigmaUpdate[player] *= SigmaWinnerCoefficient(player.Mu, player.Sigma, opponent.Mu, opponent.Sigma, resultType);

                        // Otherwise if player lost, only update based on the winner
                    } else if (standings[opponent]) {

                        // Add change in mu to running delta
                        muUpdate[player] += Mathf.Pow(MuLoserDelta(opponent.Mu, opponent.Sigma, player.Mu, player.Sigma, ResultType.NonDraw), 2);

                        // Multiply change in sigma to running coefficient
                        sigmaUpdate[player] *= SigmaLoserCoefficient(opponent.Mu, opponent.Sigma, player.Mu, player.Sigma, ResultType.NonDraw);
                    }
                }
            }

            // Save new player values
            muUpdate[player] = (standings[player] ? player.Mu + Mathf.Sqrt(muUpdate[player]) : player.Mu - Mathf.Sqrt(muUpdate[player]) / (standings.Count - 1));
            sigmaUpdate[player] = player.SigmaWithDynamics * sigmaUpdate[player];
        }

        // Update each player's standings
        foreach (Player player in standings.Keys) {

            player.Update(muUpdate[player], sigmaUpdate[player], matchNumber);
        }
    }

    public static float Gaussian(float x, float mu = 0, float sigma = 1) {

        // Calculate value of gaussian distribution with mean mu and variance sigma at point x
        float y = (1 / (sigma * Mathf.Sqrt(2 * Mathf.PI))) * Mathf.Exp(-0.5f * ((x - mu) * (x - mu) / (sigma * sigma)));
        return y;
    }

    public static float Theta(float x) {

        // Calculate value of CDF of standard normal distribution
        float y = 0.5f * (1f + ErrorFunction(x / Mathf.Sqrt(2)));
        return y;
    }

    public static float ErrorFunction(float x) {

        // Error function code via: https://www.johndcook.com/blog/csharp_erf/

        // Constants
        float a1 = 0.254829592f;
        float a2 = -0.284496736f;
        float a3 = 1.421413741f;
        float a4 = -1.453152027f;
        float a5 = 1.061405429f;
        float p = 0.3275911f;

        // Save the sign of x
        int sign = 1;
        if (x < 0)
            sign = -1;
        x = Mathf.Abs(x);

        // A&S formula 7.1.26
        float t = 1f / (1f + p * x);
        float y = 1f - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Mathf.Exp(-x * x);

        return sign * y;
    }

    public static float VFunction(float t, float eta, ResultType type = ResultType.NonDraw) {

        float y = 0;

        // Interpret based on whether or not a draw occurred
        switch (type) {
            case ResultType.Draw:

                if ((t - eta) < -5f) {
                    y = eta - t;
                }else if((t - eta) > 5f) {
                    y = t - eta;
                } else {
                    y = (Gaussian(-eta - t) - Gaussian(eta - t)) / (Theta(eta - t) - Theta(-eta - t));
                }

                break;

            case ResultType.NonDraw:

                if ((t - eta) < -5f) {
                    y = eta - t;
                } else {
                    y = Gaussian(t - eta) / Theta(t - eta);
                }
                break;
        }

        return y;
    }

    public static float WFunction(float t, float eta, ResultType type = ResultType.NonDraw) {

        float y = 0;

        // Interpret based on whether or not a draw occurred
        switch (type) {
            case ResultType.Draw:

                if (Mathf.Abs(t - eta) > 4f) {
                    y = 1f;
                } else {
                    y = Mathf.Pow(VFunction(t, eta, ResultType.Draw), 2) +
                        ((eta - t) * Gaussian(eta - t) + (eta + t) * Gaussian(eta + t)) /
                        (Theta(eta - t) - Theta(-eta - t));
                }
                    break;

            case ResultType.NonDraw:

                if ((t - eta) < -4f) {
                    y = 1f;
                } else {
                    y = VFunction(t, eta, ResultType.NonDraw) *
                        (VFunction(t, eta, ResultType.NonDraw) + t - eta);
                }
                    break;
        }

        return y;
    }

    public static float MuWinnerDelta(float muWinner, float sigmaWinner, float muLoser, float sigmaLoser, ResultType type = ResultType.NonDraw) {

        // Update mean value for winner of match
        float c = 2 * beta * beta + sigmaWinner * sigmaWinner + sigmaLoser * sigmaLoser;
        float muDelta = ((sigmaWinner * sigmaWinner + gamma * gamma) / c) * VFunction((muWinner - muLoser) / c, epsilon / c, type);
        
        return muDelta;
    }

    public static float MuLoserDelta(float muWinner, float sigmaWinner, float muLoser, float sigmaLoser, ResultType type = ResultType.NonDraw) {

        // Update mean value for loser of match
        float c = 2 * beta * beta + sigmaWinner * sigmaWinner + sigmaLoser * sigmaLoser;
        float muDelta = -1f * ((sigmaLoser * sigmaLoser + gamma * gamma) / c) * VFunction((muWinner - muLoser) / c, epsilon / c, type);

        return muDelta;
    }

    public static float SigmaWinnerCoefficient(float muWinner, float sigmaWinner, float muLoser, float sigmaLoser, ResultType type = ResultType.NonDraw) {

        // Update deviation value for winner of match
        float c = 2 * beta * beta + sigmaWinner * sigmaWinner + sigmaLoser * sigmaLoser;
        float sigmaCoefficient = Mathf.Sqrt(1 - ((sigmaWinner * sigmaWinner + gamma * gamma) / (c * c)) *
            WFunction((muWinner - muLoser) / c, epsilon / c, type));
        return sigmaCoefficient;
    }

    public static float SigmaLoserCoefficient(float muWinner, float sigmaWinner, float muLoser, float sigmaLoser, ResultType type = ResultType.NonDraw) {

        // Update deviation value for loser of match
        float c = 2 * beta * beta + sigmaWinner * sigmaWinner + sigmaLoser * sigmaLoser;
        float sigmaCoefficient = Mathf.Sqrt(1 - ((sigmaLoser * sigmaLoser + gamma * gamma) / (c * c)) *
            WFunction((muWinner - muLoser) / c, epsilon / c, type));
        return sigmaCoefficient;
    }

    public static float GaussianRandom(float mean = 0f, float deviation = 1f) {

        // Generate two uniform random numbers
        float uniform1 = Random.Range(0f, 1f);
        float uniform2 = Random.Range(0f, 1f);

        // Generate Gaussian random number from Box-Muller Transform algorithm
        float z = Mathf.Sqrt(-2f * Mathf.Log(uniform1)) * Mathf.Cos(2f * Mathf.PI * uniform2);
        float gaussianOut = mean + deviation * z;

        return gaussianOut;
    }


}
