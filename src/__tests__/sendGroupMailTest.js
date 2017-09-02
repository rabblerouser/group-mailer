const sendGroupMail = require('../sendGroupMail');

describe('sendGroupMail', () => {
  let sandbox;
  let res;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    res = {
      send: sandbox.spy(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('gives a 202', () => {
    sendGroupMail({}, res);

    expect(res.send).to.have.been.calledWith(202);
  });
});
