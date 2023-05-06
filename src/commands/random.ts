import {
    CacheType,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    SlashCommandStringOption,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import {CommandType} from "../types";
import {ErrorResponse, SafeReply} from "../helpers/responses";
import {RandomMap} from "./random/map";
import {RandomGameMode} from "./random/mode";
import {RandomChoice} from "./random/choice";

const RANDOM_MAP_SUBCOMMAND = "map";
const RANDOM_MODE_SUBCOMMAND = "mode";
const RANDOM_CHOICE_SUBCOMMAND = "choice";

const createStringOptionChoice = (choiceId: number) => {
    if (!Number.isInteger(choiceId)) {
        throw Error("Choice IDs must be integers");
    }

    return new SlashCommandStringOption()
        .setName(`choice${choiceId}`)
        .setDescription("A string which has a random chance to be selected");
};

const randomMapModule: CommandType = {
    data: new SlashCommandBuilder()
        .setName("random")
        .setDescription("Select a random value")
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(RANDOM_MAP_SUBCOMMAND)
                .setDescription("Selects a random Among Us map")
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(RANDOM_MODE_SUBCOMMAND)
                .setDescription("Selects a random Among Us game mode")
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(RANDOM_CHOICE_SUBCOMMAND)
                .setDescription("Select a random item from a custom list of options")
                .addStringOption(createStringOptionChoice(1))
                .addStringOption(createStringOptionChoice(2))
                .addStringOption(createStringOptionChoice(3))
                .addStringOption(createStringOptionChoice(4))
                .addStringOption(createStringOptionChoice(5))
                .addStringOption(createStringOptionChoice(6))
                .addStringOption(createStringOptionChoice(7))
                .addStringOption(createStringOptionChoice(8))
                .addStringOption(createStringOptionChoice(9))
        ),
    deferMode: "NO-DEFER",
    execute: async (intr: ChatInputCommandInteraction<CacheType>): Promise<any> => {
        const subcommand = intr.options.getSubcommand(true);

        switch (subcommand) {
            case RANDOM_MAP_SUBCOMMAND:
                return await RandomMap(intr);

            case RANDOM_MODE_SUBCOMMAND:
                return await RandomGameMode(intr);

            case RANDOM_CHOICE_SUBCOMMAND:
                return await RandomChoice(intr);

            default:
                return SafeReply(
                    intr,
                    ErrorResponse(
                        "Unknown subcommand",
                        "The subcommand you selected is not recognized."
                    )
                );
        }
    },
};

export {randomMapModule as command};
