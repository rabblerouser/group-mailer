# group-mailer

[![Build Status](https://api.travis-ci.org/rabblerouser/group-mailer.svg?branch=master)](https://travis-ci.org/rabblerouser/group-mailer)

Rabble Rouser service use to send emails to the member of a group.

** It needs a [group-mail-receiver](https://github.com/rabblerouser/group-mail-receiver) to get the `send-group-email` events from the event stream.**

The service:

1. Receives a `send-group-email` event which includes the `to` field that should be the email address of a group.
1. Uses the group email address to determine who the members of the group are.
1. Puts a `send-email` event on the stream to send an individual email to each member of the group.


## Run instructions

  Pre-requisites:
  * Docker


1. To run:

    `$ ./auto/dev-environment npm run`

1. To test:

    `$ ./auto/dev-environment npm test`

## Infra

The terraform code to create the group-mailer instance is currently living in the `group-mail-receiver` repo, because all of the other group mail related things are created there already (eg. the S3 bucket for emails). We're still making decisions about how we want to structure our terraform code, and so for now this is where it makes sense. We know it's counter-intuitive, and it's not going to stay there.
