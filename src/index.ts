import {Client, Collection} from "discord.js";
import {ClientType, CommandType, CronJobType, EventType} from "./types";
import {Config, LoadConfig} from "./config";
import {RegisterCommands} from "./helpers/commandManager";
import {logger} from "./logger";
import {LoadDirAs, SourceRootDir} from "./helpers/lazyModuleLoader";
import cron from "node-cron";
import path from "path";

let client: ClientType;

const start = async (): Promise<void> => {
    // Config loading
    const configPath = path.resolve("./config.json5");
    LoadConfig(configPath);
    logger.info(`Loaded config from ${configPath}`);

    const discordApiInfo = Config.devMode ? Config.development : Config.production;
    client = new Client({intents: []}) as ClientType;
    client.chatCommands = new Collection<string, CommandType>();
    logger.info("Created Discord client");

    // Command loading
    const commandsDir = path.join(SourceRootDir, "commands");
    logger.info(`Searching ${commandsDir} for commands...`);

    const commands = await LoadDirAs<{command: CommandType}>(commandsDir);
    logger.info(`Loading ${commands.length} commands...`);

    const commandsToRegister: CommandType[] = [];
    for (const {path, value} of commands) {
        const {command} = value;
        if (!command) {
            logger.warn(`Failed to load ${path} (no export named 'command')`);
            continue;
        }

        logger.debug(`Loaded ${path}`);
        client.chatCommands.set(command.data.name, command);
        commandsToRegister.push(command);
    }

    await RegisterCommands(commandsToRegister, discordApiInfo);

    // Event loading
    const eventsDir = path.join(SourceRootDir, "events");
    logger.info(`Searching ${eventsDir} for events...`);

    const events = await LoadDirAs<{event: EventType}>(eventsDir);
    logger.info(`Loading ${events.length} events...`);

    let readyEventRegistered = false;
    for (const {path, value} of events) {
        const {event} = value;
        if (!event) {
            logger.warn(`Failed to load ${path} (no export named 'event')`);
            continue;
        }

        logger.debug(`Loaded ${path} (${event.eventName})`);
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

    // Cron job loading
    const cronDir = path.join(SourceRootDir, "cron");
    logger.info(`Searching ${cronDir} for cron jobs...`);

    const jobs = await LoadDirAs<{cronJob: CronJobType}>(cronDir);
    logger.info(`Loading ${jobs.length} cron jobs...`);

    for (const {path, value} of jobs) {
        const {cronJob} = value;
        if (!cronJob) {
            logger.warn(`Failed to load ${path} (no export named 'cronJob')`);
            continue;
        }

        if (!cron.validate(cronJob.cronTimer)) {
            logger.warn(`Failed to load ${path} (invalid cron timer)`);
            continue;
        }

        logger.debug(`Loaded ${path} (${cronJob.cronTimer})`);
        cron.schedule(
            cronJob.cronTimer,
            (timerInfo) => {
                cronJob.execute(client, timerInfo);
            },
            {
                timezone: "utc",
            }
        );
    }

    client.on("error", logger.error);
    client.on("warn", logger.warn);
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
