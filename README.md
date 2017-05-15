# group-mailer

[![Build Status](https://api.travis-ci.org/rabblerouser/group-mailer.svg?branch=master)](https://travis-ci.org/rabblerouser/group-mailer)

Rabble Rouser service use to send emails to the member of a group.

** It needs a [group-mailer-receiver](https://github.com/rabblerouser/group-mail-receiver) to get the `send-group-email` events from the event stream.**

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
