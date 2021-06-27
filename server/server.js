// Environmental variable configuration
require('dotenv').config();

// Module requirements
const express = require('express');
const app = express();

// Routes
const userRouter = require('./routes/users');
app.use('/users', userRouter);

const groupRouter = require('./routes/groups');
app.use('/groups', groupRouter);

// Start listening on port
app.listen(process.env.PORT, () => console.log('Server started on port ' + process.env.PORT));