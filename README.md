# Leaderboard
 Web API for Bayesian skill-estimation leaderboard

 See writeup for more information: [Link to blog post](https://blog.seanholloway.com/2021/09/09/bayesian-skill-tracker-in-express-js-and-react-js/)

### Preface - April '24

Hello! Now that I'm a couple years removed from this project, I just wanted to give a quick summary with the benefit of hindsight.

This project was my introduction to building and deploying a client/server application in Javascript, and ultimately served as a great stepping stone into the world of modern JS. However, now that I have worked professionally as a software engineer for a few years now, it is clear to me that this code is not up to my current standard of cleanliness, readability, or testing. 

I'm still quite proud of how well this project came together for the time, and I do recommend checking out the write-up, so I am keeping it up as a public archive. However, if you are a peer or potential employer, I would refer you to either my other pinned repositories or my professional experience as a better example of my current capabilities.

## Installation

### Environmental Variables
Add .env file to designate the following variables:
API_PORT - Port to run backend server on
DB_HOST - Web host of MySQL database
DB_USER - User name for database
DB_PASS - Password for database
DB_NAME - Name of database

### NPM Installation
To install required packages for the backend:
> sudo npm --prefix ./server install

To start backend operation:
> npm --prefix ./server start

To install required packages for the frontend:
> sudo npm --prefix ./client install

To compile frontend for use:
> npm --prefix ./client run-scripts build
