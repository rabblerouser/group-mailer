'use strict';

let express = require('express');
let app = express();

app.get('/mail', function(req, res) {



  res.send('Just send that event, I\'ll process it!');
});

app.get('/status', function(req, res){
  res.sendStatus(200);
});

module.exports = app;
