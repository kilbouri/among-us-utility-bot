import {CacheType, Interaction} from "discord.js";
import {ErrorResponse, SafeDeferReply, SafeReply} from "../helpers/responses";
import {logger} from "../logger";
import {ClientType, EventType} from "../types";

const chatInputCommandHandler: EventType = {
    eventName: "interactionCreate",
    once: false,
    execute: async (client: ClientType, intr: Interaction<CacheType>) => {
        if (!intr.isChatInputCommand()) {
            return;
        }

        const command = client.chatCommands.get(intr.commandName);
        if (!command) {
            return SafeReply(
                intr,
                ErrorResponse(
                    "Command not found",
                    `The command '${intr.commandName}' could not be found on this bot... weird.`
                )
            );
        }

        try {
            if (command.deferMode !== "NO-DEFER") {
                await SafeDeferReply(intr, command.deferMode === "EPHEMERAL");
            }

            await command.execute(intr);
        } catch (err) {
            logger.error(err);
            return SafeReply(
                intr,
                ErrorResponse(
                    "Oops!",
                    "An unknown error occured. Try again later or contact an admin."
                )
            );
        }
    },
};

export {chatInputCommandHandler as event};
