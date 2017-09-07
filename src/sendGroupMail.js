const AWS = require('aws-sdk');
const uuid = require('uuid');
const mailParser = require('mailparser');
const store = require('./store');
const streamClient = require('./streamClient');
const config = require('./config');
const logger = require('./logger');

const { region, accessKeyId, secretAccessKey, s3Endpoint: endpoint } = config.aws;
const emailBucket = config.emailBucket;

const publishEmailEvent = bodyLocation => (email) => {
  const from = email.from.value[0].address;
  if (!store.getAuthorisedSenders().includes(from)) {
    return Promise.reject({ status: 401, message: 'Not an authorised email sender' });
  }
  if (email.to.value[0].address !== `everyone@${config.domain}`) {
    return Promise.reject({ status: 400, message: 'Not a valid email recipient' });
  }

  return streamClient.publish('send-email', {
    id: uuid.v4(),
    from,
    to: store.getMemberEmails(),
    subject: email.subject,
    bodyLocation,
  })
    .catch(() => Promise.reject({ status: 500, message: 'Could not publish event to stream' }));
};

const getEmailObjectAndPublishEvent = s3 => emailRecord => (
  s3.getObject({ Bucket: emailBucket, Key: emailRecord.key }).promise()
    .then(
      object => mailParser.simpleParser(object.Body),
      () => Promise.reject({ status: 400, message: 'Could not download S3 object' })
    )
    .then(publishEmailEvent(emailRecord.key))
);

const sendGroupMail = (req, res) => {
  const s3 = new AWS.S3({ region, accessKeyId, secretAccessKey, endpoint });

  return Promise.all(req.body.emailRecords.map(getEmailObjectAndPublishEvent(s3)))
    .then(() => res.status(202).send())
    .catch((error) => {
      logger.error(error.message);
      res.status(error.status).send({ error: error.message });
    });
};

module.exports = sendGroupMail;
