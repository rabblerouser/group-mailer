const createClient = require('@rabblerouser/stream-client');
const config = require('./config');

const streamClientSettings = {
  publishToStream: config.stream.streamName,
  listenWithAuthToken: config.stream.listenerAuthToken,
  readArchiveFromBucket: config.stream.archiveBucket,

  region: config.aws.region,
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,

  kinesisEndpoint: config.aws.kinesisEndpoint,
  s3Endpoint: config.aws.s3Endpoint,
};

module.exports = createClient(streamClientSettings);
