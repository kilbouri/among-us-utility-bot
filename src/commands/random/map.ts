import {randomInt} from "crypto";
import {CacheType, ChatInputCommandInteraction} from "discord.js";
import {Config} from "../../config";
import {ResponseEmbed, SafeReply} from "../../helpers/responses";

export const RandomMap = (intr: ChatInputCommandInteraction<CacheType>) => {
    const maps = Config.maps;

    const randomIndex = randomInt(maps.length);
    const selectedMap = maps[randomIndex];

    const reply = ResponseEmbed()
        .setTitle(`Random Map: ${selectedMap.name}`)
        .setImage(selectedMap.thumbnailLink);

    return SafeReply(intr, {embeds: [reply]});
};
