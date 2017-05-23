const isEmpty = require('lodash/isEmpty');

function isEmailDataValid(email) {
  return email &&
    !isEmpty(email.from) &&
    !isEmpty(email.to);
}

function sendGroupEmail(req, res) {

  if (!isEmailDataValid(req.body.email)) {
    res.sendStatus(400);
    return;
  }

  res.sendStatus(200);
}

module.exports = {
  sendGroupEmail
};
