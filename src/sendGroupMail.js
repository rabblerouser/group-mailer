const AWS = require('aws-sdk');
const uuid = require('uuid');
const store = require('./store');
const streamClient = require('./streamClient');
const config = require('./config');
const logger = require('./logger');

const { region, accessKeyId, secretAccessKey, s3Endpoint: endpoint } = config.aws;
const emailBucket = config.emailBucket;

const handleError = (res, status, error) => () => {
  logger.error(error);
  res.status(status).send({ error });
};

const getEmailObjectAndPublishEvent = (s3, res) => (emailRecord) => {
  const memberEmails = store.getMembers().map(member => member.email);

  return s3.getObject({ Bucket: emailBucket, Key: emailRecord.key }).promise()
    .then((object) => {
      logger.info(`Retrieved email data from S3 object: ${object.Body}`);

      return streamClient.publish('send-email', {
        id: uuid.v4(),
        to: memberEmails,
        bodyLocation: emailRecord.key,
      });
    }, handleError(res, 400, 'Could not download S3 object'));
};

const sendGroupMail = (req, res) => {
  const s3 = new AWS.S3({ region, accessKeyId, secretAccessKey, endpoint });

  return Promise.all(req.body.emailRecords.map(getEmailObjectAndPublishEvent(s3, res)))
    .then(() => res.status(202).send())
    .catch(handleError(res, 500, 'Could not publish event to stream'));
};

module.exports = sendGroupMail;
