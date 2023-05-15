import {readFileSync} from "fs";
import {logger} from "./logger";
import {parse as parseJSON5} from "json5";
import {GuildResolvable, RoleResolvable} from "discord.js";

interface ModeType {
    apiToken: string;
    appId: string;
    guild?: string;
}

interface ConfigType {
    // discord API config
    production: ModeType;
    development: ModeType;

    devMode: boolean;

    // Config for bot colors
    botColors: {
        successColor: number; // a hex literal is preferred
        errorColor: number;
    };

    // among us map info
    maps: {
        name: string;
        thumbnailLink: string;
    }[];

    gameModes: {
        name: string;
        thumbnailLink: string;
    }[];

    weeklyEvent: {
        creation: {
            guild: string;
            channel: string;
            cronTimer: string;
            scheduledTimeUtc: {
                dayOfWeek: number;
                hour: number;
                minute: number;
            };
        };
        eventInfo: {
            name: string;
            description?: string;
        };
    };
}

let Config: ConfigType;

const LoadConfig = (file: string) => {
    const data = readFileSync(file, "utf-8");
    Config = parseJSON5(data) as ConfigType;

    logger.level = Config.devMode ? "debug" : "info";
};

export {Config, LoadConfig, ConfigType};
