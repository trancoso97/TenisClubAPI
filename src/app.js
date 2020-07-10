const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

const ReservasRoute = require('./routes/reservasRoute')

app.use('/reservas', ReservasRoute);

module.exports = app;


