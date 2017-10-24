const checkAuth = require('../checkAuth');

describe('checkAuth', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { header: sinon.stub() };
    res = { sendStatus: sinon.spy() };
    next = sinon.spy();
  });

  it('just calls next if the auth is valid', () => {
    req.header.withArgs('Authorization').returns('secret');

    checkAuth(req, res, next);

    expect(res.sendStatus).not.to.have.been.calledWith();
    expect(next).to.have.been.calledWith();
  });

  it('fails with a 401 if the auth is missing', () => {
    req.header.withArgs('Authorization').returns(null);

    checkAuth(req, res, next);

    expect(res.sendStatus).to.have.been.calledWith(401);
    expect(next).not.to.have.been.calledWith();
  });

  it('fails with a 401 if the auth is incorrect', () => {
    req.header.withArgs('Authorization').returns('nopity nope');

    checkAuth(req, res, next);

    expect(res.sendStatus).to.have.been.calledWith(401);
    expect(next).not.to.have.been.calledWith();
  });
});
