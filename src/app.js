'use strict';

let express = require('express');
let app = express();

app.get('/mail', function(req, res){
  res.send('Just send that event, I\'ll process it!');
});

module.exports = app;
