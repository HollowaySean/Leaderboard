# Leaderboard
 Web API for Bayesian skill-estimation leaderboard

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
