import {
    ApplicationCommandOptionType,
    SlashCommandStringOption,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import {ErrorResponse, ResponseEmbed, SafeReply} from "../../helpers/responses";
import {randomInt} from "crypto";
import {SubcommandType} from "../../types";

const createStringOptionChoice = (choiceId: number) => {
    if (!Number.isInteger(choiceId)) {
        throw Error("Choice IDs must be integers");
    }

    return new SlashCommandStringOption()
        .setName(`choice${choiceId}`)
        .setDescription("A string which has a random chance to be selected");
};

export const RandomChoiceSubcommand: SubcommandType = {
    data: new SlashCommandSubcommandBuilder()
        .setName("choice")
        .setDescription("Select a random item from a custom list of options")
        .addStringOption(createStringOptionChoice(1))
        .addStringOption(createStringOptionChoice(2))
        .addStringOption(createStringOptionChoice(3))
        .addStringOption(createStringOptionChoice(4))
        .addStringOption(createStringOptionChoice(5))
        .addStringOption(createStringOptionChoice(6))
        .addStringOption(createStringOptionChoice(7))
        .addStringOption(createStringOptionChoice(8))
        .addStringOption(createStringOptionChoice(9)),
    execute: async (intr) => {
        const subcommandName = intr.options.getSubcommand();
        const candidates = intr.options.data.filter(
            (subcmd) => subcmd.name === subcommandName
        );

        // We shouldn't even hit this ever but just in case
        if (candidates.length !== 1) {
            throw Error(`More than one subcommand with the name ${subcommandName}`);
        }

        const subcommand = candidates[0];
        const choicesArray = subcommand.options //
            ?.filter((option) => option.type === ApplicationCommandOptionType.String)
            ?.filter((option) => option.value);

        // undefined/null/0-length choices array indicates no choices selected.
        if (!choicesArray || choicesArray?.length == 0) {
            return ErrorResponse(
                "At least one choice required",
                "You must provide a value for at least one `choice` option."
            );
        }

        const randomIndex = randomInt(choicesArray.length);
        const selected = choicesArray[randomIndex].value;

        const reply = ResponseEmbed().setTitle(`Random Choice: ${selected}`);
        return SafeReply(intr, {embeds: [reply]});
    },
};
