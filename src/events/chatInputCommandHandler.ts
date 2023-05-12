import {CacheType, Interaction} from "discord.js";
import {ErrorResponse, SafeDeferReply, SafeReply} from "../helpers/responses";
import {logger} from "../logger";
import {ClientType, EventType} from "../types";
import {ErrorStrings} from "../strings";

const chatInputCommandHandler: EventType = {
    eventName: "interactionCreate",
    once: false,
    execute: async (client: ClientType, intr: Interaction<CacheType>) => {
        if (!intr.isChatInputCommand()) {
            return;
        }

        const commandName = intr.commandName;
        const command = client.chatCommands.get(commandName);
        if (!command) {
            logger.warn(
                `Received chat interaction for unknown command: ${intr.commandName}`
            );
            return SafeReply(
                intr,
                ErrorResponse(
                    ErrorStrings.unknownCommand.short,
                    ErrorStrings.unknownCommand.detail
                )
            );
        }

        const subcommand = intr.options.getSubcommand(false);
        if (subcommand) {
            logger.info(`Interaction for '/${commandName} ${subcommand}'`);
        } else {
            logger.info(`Interaction for '/${commandName}'`);
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
                    ErrorStrings.unknownError.short,
                    ErrorStrings.unknownError.detail
                )
            );
        }
    },
};

export {chatInputCommandHandler as event};
