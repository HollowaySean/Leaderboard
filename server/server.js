// Environmental variable configuration
require('dotenv').config();

// Module requirements
const express = require('express');
const app = express();

// Router requirements
// const lbRouter = require('./routes/leaderboard');
// app.use('/lb', lbRouter);

// const loginRouter = require('./routes/login');
// app.use('/login', loginRouter);

// Start listening on port
app.listen(process.env.PORT, () => console.log('Server started on port ' + process.env.PORT));