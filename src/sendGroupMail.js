const AWS = require('aws-sdk');
const uuid = require('uuid');
const mailParser = require('mailparser');
const store = require('./store');
const streamClient = require('./streamClient');
const config = require('./config');
const logger = require('./logger');

const { region, accessKeyId, secretAccessKey, s3Endpoint: endpoint } = config.aws;
const emailBucket = config.emailBucket;

const publishEmailEvent = (s3ObjectKey, email) => {
  const from = email.from.value[0].address;
  if (!store.getAuthorisedSenders().includes(from)) {
    return Promise.reject({ status: 401, message: 'Not an authorised email sender' });
  }
  if (email.to.value[0].address !== `everyone@${config.domain}`) {
    return Promise.reject({ status: 400, message: `Not a valid email recipient: ${email.to.value[0].address}` });
  }

  return streamClient.publish('send-email', {
    id: uuid.v4(),
    date: new Date().toISOString(),
    from: `mail@${config.domain}`,
    to: store.getMemberEmails(),
    subject: email.subject,
    bodyLocation: {
      key: s3ObjectKey,
    },
  })
    .catch(() => Promise.reject({ status: 500, message: 'Could not publish event to stream' }));
};

const getEmailObjectAndPublishEvent = async (s3, s3ObjectKey) => {
  try {
    const s3Object = await s3.getObject({ Bucket: emailBucket, Key: s3ObjectKey }).promise();
    const email = await mailParser.simpleParser(s3Object.Body);
    return publishEmailEvent(s3ObjectKey, email);
  } catch (e) {
    logger.error(`Could not download S3 object: ${emailBucket}/${s3ObjectKey} : ${e}`);
    return Promise.reject({ status: 400, message: 'Could not download S3 object' });
  }
};

const sendGroupMail = (req, res) => {
  const s3 = new AWS.S3({ region, accessKeyId, secretAccessKey, endpoint });

  return getEmailObjectAndPublishEvent(s3, req.body.s3ObjectKey)
    .then(() => res.status(202).send())
    .catch((error) => {
      logger.error(error.message);
      res.status(error.status).send({ error: error.message });
    });
};

module.exports = sendGroupMail;
