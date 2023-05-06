import {randomInt} from "crypto";
import {CacheType, ChatInputCommandInteraction} from "discord.js";
import {Config} from "../../config";
import {ResponseEmbed, SafeReply} from "../../helpers/responses";

export const RandomGameMode = (intr: ChatInputCommandInteraction<CacheType>) => {
    const modes = Config.gameModes;

    const randomIndex = randomInt(modes.length);
    const selectedMode = modes[randomIndex];

    const reply = ResponseEmbed()
        .setTitle(`Random Game Mode: ${selectedMode.name}`)
        .setImage(selectedMode.thumbnailLink);

    return SafeReply(intr, {embeds: [reply]});
};
