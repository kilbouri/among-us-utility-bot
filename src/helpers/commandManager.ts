import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v10";
import {Collection} from "discord.js";
import {CommandType} from "../types";

/** Maps a Guild onto a map from name to ID */
export const CommandIDCache = new Collection<string, Collection<string, string>>();
export const GlobalGuild = "global";

export const ClearCommands = async (options: {
    guild?: string;
    apiToken: string;
    appId: string;
}) => {
    const {guild, apiToken, appId} = options;

    const rest = new REST({version: "10"}).setToken(apiToken);
    const route =
        guild === undefined
            ? Routes.applicationCommands(appId)
            : Routes.applicationGuildCommands(appId, guild);

    await rest.put(route, {body: []});
    CommandIDCache.set(guild ?? GlobalGuild, new Collection<string, string>());
};

export const RegisterCommands = async (
    commands: CommandType[],
    options: {
        guild?: string;
        apiToken: string;
        appId: string;
    }
): Promise<number> => {
    const {guild, apiToken, appId} = options;

    const rest = new REST({version: "10"}).setToken(apiToken);
    const route =
        guild === undefined
            ? Routes.applicationCommands(appId)
            : Routes.applicationGuildCommands(appId, guild);

    const cmdArr = commands.map((command) => command.data.toJSON());
    const response = (await rest.put(route, {body: cmdArr})) as {
        id: string;
        name: string;
    }[];

    let cache = CommandIDCache.get(guild ?? GlobalGuild);
    if (!cache) {
        let newCache = new Collection<string, string>();
        CommandIDCache.set(guild ?? GlobalGuild, newCache);
        cache = newCache;
    }

    for (const {id, name} of response) {
        cache.set(name, id);
    }

    return response.length;
};
