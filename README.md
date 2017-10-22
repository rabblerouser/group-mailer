# group-mailer

[![Build Status](https://api.travis-ci.org/rabblerouser/group-mailer.svg?branch=master)](https://travis-ci.org/rabblerouser/group-mailer)

Rabble Rouser service use to send emails to the member of a group.

** It needs a [group-mail-receiver](https://github.com/rabblerouser/group-mail-receiver) to notify it when new email request objects are uploaded to S3.**

The service:

1. Receives a POST request pointing it at an S3 object which contains an email request.
1. Uses the S3 data to authenticate the request and determine who should receive the final email.
1. Puts a `send-email` event on the stream to send an individual email to each member of the group.


## Run instructions

  Pre-requisites:
  * Docker

1. To seed:

    `$ ./auto/dev-environment yarn seed`

1. To run:

    `$ ./auto/dev-environment yarn start`

1. To test:

    `$ ./auto/dev-environment yarn test`

## Send a test request
To test the application manually, you can simulate the uploading of an email to S3, and then trigger the application via
POST request. With the services all started (see above), run these commands:

```
aws --endpoint-url='http://localhost:4569' s3api put-object --bucket email-bucket --key some-email-object --body src/fixtures/mimeFile.txt
curl localhost:3000/mail -H 'Content-Type: application/json' -d '{ "emailRecords": [{ "key": "some-email-object" }] }'
```

## Infra

The terraform code to create the group-mailer instance is currently living in the `group-mail-receiver` repo, because all of the other group mail related things are created there already (eg. the S3 bucket for emails). We're still making decisions about how we want to structure our terraform code, and so for now this is where it makes sense. We know it's counter-intuitive, and it's not going to stay there.
