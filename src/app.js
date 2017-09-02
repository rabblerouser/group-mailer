'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let app = express();
const streamClient = require('./streamClient');

app.use(bodyParser.json());

app.post('/mail', function(req, res){
  console.log(req.body);
  res.sendStatus(202);
});

app.get('/status', function(req, res){
  res.sendStatus(200);
});

module.exports = app;
