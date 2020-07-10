const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

const ReservasRoute = require('./routes/reservasRoute')
const DispRoute = require('./routes/disponibilidadeRoute');

app.use('/reservas', ReservasRoute);
app.use('/disponibilidade', DispRoute);

module.exports = app;


