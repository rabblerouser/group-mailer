'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let app = express();
const streamClient = require('./streamClient');
const store = require('./store');

app.use(bodyParser.json());

streamClient.on('member-registered', store.createMember);
streamClient.on('member-removed', store.deleteMember);
streamClient.on('member-edited', store.updateMember);
app.post('/events', streamClient.listen());


app.get('/members', (req, res) => res.json(store.getMembers())); // TODO: Delete me!


app.post('/mail', function(req, res){
  console.log(req.body);
  res.sendStatus(202);
});

app.get('/status', function(req, res){
  res.sendStatus(200);
});

module.exports = app;
