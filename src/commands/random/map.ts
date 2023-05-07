import {randomInt} from "crypto";
import {
    CacheType,
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import {Config} from "../../config";
import {ResponseEmbed, SafeReply} from "../../helpers/responses";
import {SubcommandType} from "../../types";

export const RandomMapSubcommand: SubcommandType = {
    data: new SlashCommandSubcommandBuilder()
        .setName("map")
        .setDescription("Selects a random Among Us map"),
    execute: async (intr: ChatInputCommandInteraction<CacheType>) => {
        const maps = Config.maps;

        const randomIndex = randomInt(maps.length);
        const selectedMap = maps[randomIndex];

        const reply = ResponseEmbed()
            .setTitle(`Random Map: ${selectedMap.name}`)
            .setImage(selectedMap.thumbnailLink);

        return SafeReply(intr, {embeds: [reply]});
    },
};
