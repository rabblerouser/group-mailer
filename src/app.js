const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const streamClient = require('./streamClient');
const store = require('./store');
const sendGroupMail = require('./sendGroupMail');

const app = express();
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(bodyParser.json());

streamClient.on('member-registered', store.createMember);
streamClient.on('member-removed', store.deleteMember);
streamClient.on('member-edited', store.updateMember);

app.post('/events', streamClient.listen());
app.post('/mail', sendGroupMail);

app.get('/status', (req, res) => {
  res.sendStatus(200);
});

module.exports = app;
