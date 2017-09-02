const createClient = require('@rabblerouser/stream-client');

const streamClientSettings = {
  publishToStream: process.env.STREAM_NAME || 'rabblerouser_stream',
  listenWithAuthToken: process.env.LISTENER_AUTH_TOKEN || 'secret',
  readArchiveFromBucket: process.env.ARCHIVE_BUCKET || 'rr-event-archive',

  region: process.env.AWS_REGION || 'ap-southeast-2',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'FAKE',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'ALSO FAKE',

  kinesisEndpoint: process.env.KINESIS_ENDPOINT,
  s3Endpoint: process.env.S3_ENDPOINT,
};

module.exports = createClient(streamClientSettings);
