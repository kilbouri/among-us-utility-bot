import {CacheType, ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {CommandType} from "../types";
import {ErrorResponse, SafeReply} from "../helpers/responses";
import {RandomMapSubcommand} from "./random/map";
import {RandomGameModeSubcommand} from "./random/mode";
import {RandomChoiceSubcommand} from "./random/choice";
import {ErrorStrings} from "../strings";

const randomMapModule: CommandType = {
    data: new SlashCommandBuilder()
        .setName("random")
        .setDescription("Select a random value")
        .addSubcommand(RandomChoiceSubcommand.data)
        .addSubcommand(RandomMapSubcommand.data)
        .addSubcommand(RandomGameModeSubcommand.data),
    deferMode: "NO-DEFER",
    execute: async (intr: ChatInputCommandInteraction<CacheType>): Promise<any> => {
        const subcommand = intr.options.getSubcommand(true);

        switch (subcommand) {
            case RandomMapSubcommand.data.name:
                return RandomMapSubcommand.execute(intr);

            case RandomGameModeSubcommand.data.name:
                return RandomGameModeSubcommand.execute(intr);

            case RandomChoiceSubcommand.data.name:
                return RandomChoiceSubcommand.execute(intr);

            default:
                return SafeReply(
                    intr,
                    ErrorResponse(
                        ErrorStrings.unknownSubcommand.short,
                        ErrorStrings.unknownSubcommand.detail
                    )
                );
        }
    },
};

export {randomMapModule as command};
