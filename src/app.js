'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.json());

app.post('/mail', function(req, res){
  res.send(req.body);
});

app.get('/status', function(req, res){
  res.sendStatus(200);
});

module.exports = app;
