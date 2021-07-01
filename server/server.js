// Environmental variable configuration
require('dotenv').config({path : __dirname+'/../.env'});

// Module requirements
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

// Routes
const userRouter = require('./routes/users');
app.use('/users', userRouter);

const groupRouter = require('./routes/groups');
app.use('/groups', groupRouter);

const deckRouter = require('./routes/decks');
app.use('/decks', deckRouter);

app.get('/test', async (req, res) => {
    res.status(201).send('Success!');
});

// Start listening on port
app.listen(process.env.API_PORT, () => console.log('Server started on port ' + process.env.API_PORT));