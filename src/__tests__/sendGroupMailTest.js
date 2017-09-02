const AWS = require('aws-sdk');
const uuid = require('uuid');
const streamClient = require('../streamClient');
const sendGroupMail = require('../sendGroupMail');
const store = require('../store');

describe('sendGroupMail', () => {
  let sandbox;
  let s3;
  let res;
  const req = { body: { emailRecords: [{ key: 'email-object' }] } };
  const emailObject = { Body: 'Some email body' };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    res = { status: sandbox.stub(), send: sinon.stub() };
    res.status.returns(res);
    s3 = { getObject: sinon.stub() };
    sandbox.stub(AWS, 'S3').returns(s3);
    sandbox.stub(streamClient, 'publish').resolves();
    sandbox.stub(uuid, 'v4').returns('some-uuid');
    sandbox.stub(store, 'getMembers').returns([
      { email: 'john@example.com' },
      { email: 'jane@example.com' },
    ]);
  });

  afterEach(() => {
    sandbox.restore();
  });

  const awsSuccess = data => ({ promise: () => Promise.resolve(data) });
  const awsFailure = error => ({ promise: () => Promise.reject(error) });

  it('puts a send-email event on the stream and returns 202', () => {
    s3.getObject.withArgs({ Bucket: 'email-bucket', Key: 'email-object' }).returns(awsSuccess(emailObject));

    return sendGroupMail(req, res)
      .then(() => {
        expect(streamClient.publish).to.have.been.calledWith('send-email', {
          id: 'some-uuid',
          to: ['john@example.com', 'jane@example.com'],
          bodyLocation: 'email-object',
        });
        expect(res.status).to.have.been.calledWith(202);
      });
  });

  it('publishes one event per record in the payload', () => {
    s3.getObject.withArgs({ Bucket: 'email-bucket', Key: 'email-object' }).returns(awsSuccess(emailObject));
    s3.getObject.withArgs({ Bucket: 'email-bucket', Key: 'other-email-object' }).returns(awsSuccess(emailObject));

    const multiRecordRequest = { body: { emailRecords: [{ key: 'email-object' }, { key: 'other-email-object' }] } };

    return sendGroupMail(multiRecordRequest, res)
      .then(() => {
        expect(streamClient.publish.callCount).to.eql(2);
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
    s3.getObject.withArgs({ Bucket: 'email-bucket', Key: 'email-object' }).returns(awsSuccess(emailObject));
    streamClient.publish.rejects();

    return sendGroupMail(req, res)
      .then(() => {
        expect(res.status).to.have.been.calledWith(500);
        expect(res.send).to.have.been.calledWith({ error: 'Could not publish event to stream' });
      });
  });
});
