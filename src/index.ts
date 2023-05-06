import {Client, Collection, GatewayIntentBits} from "discord.js";
import {ClientType, CommandType, EventType} from "./types";
import {Config, LoadConfig} from "./config";
import {RegisterCommands} from "./helpers/commandManager";
import {logger} from "./logger";
import {readdirSync} from "fs";
import {format as formatPath} from "path";

let client: ClientType;

const start = async (): Promise<void> => {
    // Config loading
    logger.info("Loading config...");
    LoadConfig("config.json5");

    const discordApiInfo = Config.devMode ? Config.development : Config.production;

    // Bot API authentications
    logger.info("Authenticating with APIs...");
    client = new Client({
        intents: [],
    }) as ClientType;
    client.chatCommands = new Collection<string, CommandType>();

    // Command loading
    const commandFiles = readdirSync("./src/commands") //
        .filter((name) => name.endsWith(".ts"));

    logger.info(`Loading ${commandFiles.length} commands...`);
    const commandsToRegister = [];
    for (const file of commandFiles) {
        const filePath = formatPath({dir: "./commands/", name: file});
        const {command} = (await import(filePath)) as {command: CommandType};

        if (!command) {
            logger.warn(`Failed to load ${file} (no export named 'command')`);
            continue;
        }

        logger.debug(`Loaded ${file}`);
        client.chatCommands.set(command.data.name, command);
        commandsToRegister.push(command);
    }

    await RegisterCommands(commandsToRegister, discordApiInfo);

    // Event loading
    const eventFiles = readdirSync("./src/events") //
        .filter((name) => name.endsWith(".ts"));

    logger.info(`Loading ${commandFiles.length} events...`);

    let readyEventRegistered = false;
    for (const file of eventFiles) {
        const filePath = formatPath({dir: "./events/", name: file});
        const {event} = (await import(filePath)) as {event: EventType};

        if (!event) {
            logger.warn(`Failed to load ${file} (no export named 'event')`);
            continue;
        }

        logger.debug(`Loaded ${file} (${event.eventName})`);

        readyEventRegistered ||= event.eventName === "ready";

        const eventCallback = (...args: any[]) => event.execute(client, ...args);
        if (event.once) {
            client.once(event.eventName, eventCallback);
        } else {
            client.on(event.eventName, eventCallback);
        }
    }

    if (!readyEventRegistered) {
        logger.error("No 'ready' event listener was registered. Bot will not start.");
        process.exit();
    }

    if (Config.devMode) {
        client.on("error", logger.error);
        client.on("warn", logger.warn);
    }

    await client.login(discordApiInfo.apiToken);
};

// graceful exit handler
require("shutdown-handler").on("exit", (event: Event) => {
    event.preventDefault(); // delay process closing

    client.emit("shutdown");

    logger.info("Graceful shutdown completed. Exiting...");
    process.exit();
});

// start bot
start();
