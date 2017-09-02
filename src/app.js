const express = require('express');
const bodyParser = require('body-parser');
const streamClient = require('./streamClient');
const store = require('./store');

const app = express();
app.use(bodyParser.json());

streamClient.on('member-registered', store.createMember);
streamClient.on('member-removed', store.deleteMember);
streamClient.on('member-edited', store.updateMember);

app.post('/events', streamClient.listen());

app.post('/mail', (req, res) => {
  console.log(req.body);
  res.sendStatus(202);
});

app.get('/status', (req, res) => {
  res.sendStatus(200);
});

module.exports = app;
