import {logger} from "../logger";
import {ClientType, EventType} from "../types";

const readyEventModule: EventType = {
    eventName: "ready",
    once: true,
    execute: async (client: ClientType) => {
        logger.info("Bot is ready.");
    },
};

export {readyEventModule as event};
