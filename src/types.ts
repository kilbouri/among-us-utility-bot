import {
    ButtonInteraction,
    CacheType,
    ChatInputCommandInteraction,
    Client,
    Collection,
    CommandInteraction,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export interface CommandType {
    data:
        | SlashCommandBuilder
        | SlashCommandSubcommandsOnlyBuilder
        | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">;
    deferMode: "NORMAL" | "EPHEMERAL" | "NO-DEFER";
    execute: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<any>;
}

export interface EventType {
    eventName: string;
    once: boolean;
    execute: (client: ClientType, ...args: any[]) => Promise<any>;
}

export interface ButtonAction {
    execute: (interaction: ButtonInteraction<CacheType>) => Promise<any>;
}

export interface ClientType extends Client {
    chatCommands: Collection<string, CommandType>;
}
