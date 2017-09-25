module.exports = {
  stream: {
    streamName: process.env.STREAM_NAME || 'rabblerouser_stream',
    listenerAuthToken: process.env.LISTENER_AUTH_TOKEN || 'secret',
    archiveBucket: process.env.ARCHIVE_BUCKET || 'rr-event-archive',
  },

  emailBucket: process.env.S3_EMAILS_BUCKET || 'email-bucket',
  domain: process.env.DOMAIN || 'example.com',

  aws: {
    region: process.env.AWS_REGION || 'ap-southeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'FAKE',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'ALSO FAKE',
    kinesisEndpoint: process.env.KINESIS_ENDPOINT,
    s3Endpoint: process.env.S3_ENDPOINT,
  },
};
