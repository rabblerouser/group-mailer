function isEmailInformationValid() {
  return false;
}

function sendGroupEmail(req, res) {

  if (!isEmailInformationValid()) {
    res.sendStatus(400);
  }

  res.sendStatus(200);
}


module.exports = {
  sendGroupEmail
};
