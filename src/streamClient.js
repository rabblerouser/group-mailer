const createClient = require('@rabblerouser/stream-client');
const config = require('./config');
const logger = require('./logger');

const streamClientSettings = {
  publishToStream: config.stream.streamName,
  listenWithAuthToken: config.stream.listenerAuthToken,
  readArchiveFromBucket: config.stream.archiveBucket,

  region: config.aws.region,
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,

  kinesisEndpoint: config.aws.kinesisEndpoint,
  s3Endpoint: config.aws.s3Endpoint,

  logger,
};

module.exports = createClient(streamClientSettings);
