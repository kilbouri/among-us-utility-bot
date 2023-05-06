import {
    ApplicationCommandOptionType,
    CacheType,
    ChatInputCommandInteraction,
} from "discord.js";
import {ErrorResponse, ResponseEmbed, SafeReply} from "../../helpers/responses";
import {randomInt} from "crypto";

export const RandomChoice = (intr: ChatInputCommandInteraction<CacheType>) => {
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
};
