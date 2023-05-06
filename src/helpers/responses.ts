import {
    CacheType,
    CommandInteraction,
    EmbedBuilder,
    InteractionReplyOptions,
    MessageComponentInteraction,
    MessagePayload,
} from "discord.js";
import {Config} from "../config";
import {logger} from "../logger";

// UTILITIES ------------------------------------------------------------------

/**
 * Responds to an interaction, safely. Will not crash in the
 * event of an already-replied interaction.
 * @param intr The interaction to reply to
 * @param reply The reply to send
 * @returns A promise to the reply, just as if `intr.reply` had been used.
 */
export const SafeReply = (
    intr: CommandInteraction<CacheType> | MessageComponentInteraction,
    reply: MessagePayload | InteractionReplyOptions
) => {
    try {
        if (intr.replied) {
            return intr.followUp(reply);
        } else if (intr.deferred) {
            return intr.editReply(reply);
        } else {
            return intr.reply(reply);
        }
    } catch (err) {
        logger.error(`Reply failed: ${err}`);
    }
    return null;
};

/**
 * @param intr The interaction to defer responding to
 * @param ephemeral Whether or not the deferral should be ephemeral (default false)
 * @returns a promise that resolves either on error (which is caught and logged) or on success
 */
export const SafeDeferReply = async (
    intr: CommandInteraction<CacheType>,
    ephemeral: boolean = false
) => {
    try {
        if (!intr.deferred && !intr.replied) {
            return intr.deferReply({ephemeral: ephemeral});
        }
    } catch (err) {
        logger.error(`Deferral failed: ${err}`);
    }
};

/**
 * A pre-constructed reply helper for an embed containing an error
 * mesage and description, as well as optimistic ephemerality.
 * @param title A short description of the error
 * @param description A more formal description of what went wrong
 * @returns A reply to an interaction containing an embed with the specified details.
 */
export const ErrorResponse = (
    title: string,
    description: string
): InteractionReplyOptions => {
    return {
        ephemeral: true,
        embeds: [
            new EmbedBuilder()
                .setColor(Config.botColors.errorColor)
                .setTitle(title)
                .setDescription(description),
        ],
    };
};

/**
 * Base embed for all replies.
 * @returns A MessageEmbed builder with default styling
 */
export const ResponseEmbed = () => {
    return new EmbedBuilder().setColor(Config.botColors.successColor);
};
