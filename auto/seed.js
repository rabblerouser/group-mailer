// This script creates a kinesis stream and S3 buckets for local development.
// In production, this job should be done by e.g. terraform.

const AWS = require('aws-sdk');
const uuid = require('uuid');

const s3Endpoint = process.env.S3_ENDPOINT;
const emailsBucket = process.env.S3_EMAILS_BUCKET;
const archiveBucket = process.env.ARCHIVE_BUCKET;
const StreamName = process.env.STREAM_NAME;

const s3 = new AWS.S3({
  endpoint: s3Endpoint,
  region: 'ap-southeast-2',
  accessKeyId: 'FAKE',
  secretAccessKey: 'ALSO FAKE',
});

console.log('Creating email bucket...');
s3.createBucket({ Bucket: emailsBucket }).promise()
  .then(
    () => console.log('Email bucket created!'),
    (err) => { throw new Error(`Could not create email bucket: ${err.message}`); }
  );

console.log('Creating archive bucket...');
s3.createBucket({ Bucket: archiveBucket }).promise()
  .then(
    () => console.log('Archive bucket created!'),
    (err) => { throw new Error(`Could not create archive bucket: ${err.message}`); }
  );

const kinesis = new AWS.Kinesis({
  endpoint: process.env.KINESIS_ENDPOINT,
  region: 'ap-southeast-2',
  accessKeyId: 'FAKE',
  secretAccessKey: 'ALSO FAKE',
});

console.log('Creating kinesis stream...');
kinesis.createStream({ StreamName, ShardCount: 1 }).promise().then(
  () => console.log('Stream created!'),
  (err) => {
    // Swallow these errors, but fail on all others
    if (err.message.includes('already exists!')) {
      console.log('Stream already exists!');
      return;
    }
    throw new Error(`Could not create stream: ${err.message}`);
  }
)
  .then(() => {
    console.log('Waiting a few seconds for the stream to be ready...');
    return new Promise(resolve => setTimeout(resolve, 3000));
  })
  .then(() => {
    const email = 'admin@rabblerouser.team';
    console.log('Creating a default admin user:', email);
    kinesis.putRecord({
      Data: JSON.stringify({ type: 'admin-created', data: { id: uuid.v4(), email } }),
      PartitionKey: 'admin-created',
      StreamName,
    }).promise();
  })
  .then(
    () => console.log('Admin user created'),
    () => { throw new Error('Failed to create admin user!'); }
  );
