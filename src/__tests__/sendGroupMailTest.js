const AWS = require('aws-sdk');
const uuid = require('uuid');
const mailParser = require('mailparser');
const streamClient = require('../streamClient');
const sendGroupMail = require('../sendGroupMail');
const store = require('../store');

describe('sendGroupMail', () => {
  let sandbox;
  let s3;
  let res;
  const req = { body: { s3ObjectKey: 'email-object' } };
  const s3Object = { Body: 'Some email body' };

  const awsSuccess = data => ({ promise: () => Promise.resolve(data) });
  const awsFailure = error => ({ promise: () => Promise.reject(error) });
  const emailData = ({ subject = 'Some Subject', from = 'someone@gmail.com', to = 'everyone@example.com' } = {}) => ({
    subject,
    from: { value: [{ address: from }] },
    to: { value: [{ address: to }] },
  });

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    res = { status: sandbox.stub(), send: sinon.stub() };
    res.status.returns(res);
    s3 = { getObject: sinon.stub() };
    sandbox.stub(AWS, 'S3').returns(s3);
    s3.getObject.withArgs({ Bucket: 'email-bucket', Key: 'email-object' }).returns(awsSuccess(s3Object));
    sandbox.stub(mailParser, 'simpleParser').withArgs('Some email body').returns(emailData());
    sandbox.stub(streamClient, 'publish').resolves();
    sandbox.stub(uuid, 'v4').returns('some-uuid');
    sandbox.stub(store, 'getMemberEmails').returns(['john@hotmail.com', 'jane@yahoo.com']);
    sandbox.stub(store, 'getAuthorisedSenders').returns(['someone@gmail.com']);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('puts a send-email event on the stream and returns 202', () => (
    sendGroupMail(req, res)
      .then(() => {
        expect(streamClient.publish).to.have.been.calledWith('send-email', {
          id: 'some-uuid',
          from: 'mail@example.com',
          to: ['john@hotmail.com', 'jane@yahoo.com'],
          subject: 'Some Subject',
          bodyLocation: {
            key: 'email-object',
          },
        });
        expect(res.status).to.have.been.calledWith(202);
      })
  ));

  it('gives a 400 if the email is not being sent to everyone', () => {
    mailParser.simpleParser.withArgs('Some email body').returns(emailData({ to: 'wrong@wrong.com' }));

    return sendGroupMail(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(400);
        expect(res.send).to.have.been.calledWith({ error: 'Not a valid email recipient: wrong@wrong.com' });
      });
  });

  it('gives a 401 if the sender is not authorised', () => {
    mailParser.simpleParser.withArgs('Some email body').returns(emailData({ from: 'wrong@wrong.com' }));

    return sendGroupMail(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(401);
        expect(res.send).to.have.been.calledWith({ error: 'Not an authorised email sender' });
      });
  });

  it('gives a 400 if the object cannot be fetched', () => {
    s3.getObject.withArgs({ Bucket: 'email-bucket', Key: 'email-object' }).returns(awsFailure());

    return sendGroupMail(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(400);
        expect(res.send).to.have.been.calledWith({ error: 'Could not download S3 object' });
      });
  });

  it('gives a 500 if the event publishing fails', () => {
    streamClient.publish.rejects();

    return sendGroupMail(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(500);
        expect(res.send).to.have.been.calledWith({ error: 'Could not publish event to stream' });
      });
  });
});
