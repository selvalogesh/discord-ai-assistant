# Huggingface Credentials Documentation

> To be able to use an instance of the bot properly, you want to setup your Huggingface Credentials. Adding these credentials makes it possible for you to pair with servers as well as running models in them.

## Retrieving Huggingface Credentials

* [Create Account](https://huggingface.co/join).
* Once created [Generate Access Token](https://huggingface.co/docs/hub/security-tokens).
* Past the generated token using `/credentials add` command in discord channel.
* AI bot only replies to text messaged from `teamchat` channel.
* You are all set 👍, Enjoy !

## Why is Huggingface Credentials necessary?

Huggingface Credentials are necessary in order to get the following:

* Resource must be shared
* Running LLM inference is costly
* Usage tracking and rate limiting

Without these, the bot would not operate properly.