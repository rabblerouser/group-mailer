const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const streamClient = require('./streamClient');
const store = require('./store');
const checkAuth = require('./checkAuth');
const sendGroupMail = require('./sendGroupMail');

const app = express();
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(bodyParser.json());

streamClient.on('member-registered', store.registerMember);
streamClient.on('member-removed', store.removeMember);
streamClient.on('member-edited', store.editMember);

streamClient.on('admin-created', store.createAdmin);
streamClient.on('admin-removed', store.removeAdmin);
streamClient.on('admin-edited', store.editAdmin);

app.post('/events', streamClient.listen());
app.post('/mail', checkAuth, sendGroupMail);

app.get('/status', (req, res) => {
  res.sendStatus(200);
});

module.exports = app;
