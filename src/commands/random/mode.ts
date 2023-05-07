import {randomInt} from "crypto";
import {
    CacheType,
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import {Config} from "../../config";
import {ResponseEmbed, SafeReply} from "../../helpers/responses";
import {SubcommandType} from "../../types";

export const RandomGameModeSubcommand: SubcommandType = {
    data: new SlashCommandSubcommandBuilder()
        .setName("mode")
        .setDescription("Selects a random Among Us game mode"),
    execute: async (intr: ChatInputCommandInteraction<CacheType>) => {
        const modes = Config.gameModes;

        const randomIndex = randomInt(modes.length);
        const selectedMode = modes[randomIndex];

        const reply = ResponseEmbed()
            .setTitle(`Random Game Mode: ${selectedMode.name}`)
            .setImage(selectedMode.thumbnailLink);

        return SafeReply(intr, {embeds: [reply]});
    },
};
