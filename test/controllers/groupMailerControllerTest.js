'use strict';
const controller = require('../../src/controllers/groupMailerController');

describe('groupMailerController', () => {
  let req, res;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    res = {
      sendStatus: sinon.spy(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('sendGroupEmail', () => {
    describe('when the group-email data is not as per contract', () => {

      it('should return 400', () => {
        req = { body: { } };

        controller.sendGroupEmail(req, res);
        expect(res.sendStatus).to.have.been.calledWith(400);
      });

      it('should send an group-email-failed event??');
    });

    describe('when the group-email data is as per contract', () => {
      it('should return 200', () => {
        req = {
          body: {
            email: {
              from: 'jules.admin@gmail.com',
              to: '23840234809234832094823904@rr-weird-instance.com',
              subject: 'Attention citizens!',
              body: 'Email body'
            }
          }
        };


        controller.sendGroupEmail(req, res);
        expect(res.sendStatus).to.have.been.calledWith(200);
      });

      it('should trigger the process for sending the group-email');
    });
  });
});
