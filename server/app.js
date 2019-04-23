const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// mongo models

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/APIAuth', { useNewUrlParser: true });

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

// Routes
app.use('/users', require('./routes/users'))

// Start the server
const port = process.env.PORT || 3000;

app.listen(port);
console.log(`Server listening at ${port}`);
