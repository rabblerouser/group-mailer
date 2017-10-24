const config = require('./config');

const checkAuth = (req, res, next) => {
  const auth = req.header('Authorization');
  if (!auth || auth !== config.groupMailReceiverAuthToken) {
    return res.sendStatus(401);
  }
  return next();
};

module.exports = checkAuth;
