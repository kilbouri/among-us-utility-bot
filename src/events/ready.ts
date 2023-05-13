import {ActivityType} from "discord.js";
import {logger} from "../logger";
import {ClientType, EventType} from "../types";

const readyEventModule: EventType = {
    eventName: "ready",
    once: true,
    execute: async (client: ClientType) => {
        client.user!.setActivity({
            type: ActivityType.Watching,
            name: "for impostors",
        });

        logger.info("Bot is ready.");
    },
};

export {readyEventModule as event};
