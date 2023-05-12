# Among Us Utility Bot

A simple Discord bot that provides utilities for groups looking to play Among Us together.

## Features

- Random map selection (`config.example.json5` is preconfigured with the stock Among Us maps)
- Random mode selection (`config.example.json5` is preconfigured with the stock Among Us modes)
- Random selection from up to 10 strings

### Screenshots

| Random Mode                                                       | Random Map                                                      |
| ----------------------------------------------------------------- | --------------------------------------------------------------- |
| ![Random mode choice in Discord](./readme_images/random_mode.png) | ![Random map choice in Discord](./readme_images/random_map.png) |


## Build & Run

### Development

Just run `yarn dev`. No build is required, as the bot will run in `ts-node`. You can use `yarn dev-pretty` to run with prettified logs.

### Production/Hosting

Use `yarn build` to build the bot, then `yarn host` to start the bot.

> Building and hosting are separated because changes to `config.json5` do not require a complete re-build of the bot.
