# Slacks

A small proxy for [Slack](http://slack.com) WebHooks.

## Setup

This application requires node `>= 0.11.13`. I advice you to use something like [nvm](https://github.com/creationix/nvm).

Setup port forwarding on your local network and add your ip as an URL to the Slack Outgoing WebHook. Also copy the `token` while you're there.

### Run the setup script (have your Slack token in hand)

```bash
$ ./bin/setup
```

### Start the server

```bash
$ npm start
```
