import {GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel} from "discord.js";
import {Config} from "../config";
import {logger} from "../logger";
import {CronJobType} from "../types";

const createWeeklyEventModule: CronJobType = {
    cronTimer: Config.weeklyEvent.creation.cronTimer,
    execute: async (client, timerInfo) => {
        const utcDate: Date =
            timerInfo === "init" || timerInfo === "manual" //
                ? new Date()
                : timerInfo;

        logger.info(`Create Weekly Event job invoked`);

        const {dayOfWeek, hour, minute} = Config.weeklyEvent.creation.scheduledTimeUtc;

        const nextEventDay = getNextDayOfWeek(utcDate, dayOfWeek);
        nextEventDay.setUTCHours(hour, minute, 0, 0);

        logger.debug(`Scheduling event for ${nextEventDay.toISOString()}`);

        const guild = client.guilds.cache.get(Config.weeklyEvent.creation.guild);
        if (!guild) {
            logger.error(`Guild '${Config.weeklyEvent.creation.guild}' does not exist`);
            return;
        }

        const event = await guild.scheduledEvents.create({
            privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
            entityType: GuildScheduledEventEntityType.Voice,
            channel: Config.weeklyEvent.creation.channel,
            name: Config.weeklyEvent.eventInfo.name,
            description: Config.weeklyEvent.eventInfo.description,
            scheduledStartTime: nextEventDay,
        });

        if (!event.isScheduled()) {
            logger.error("Failed to register weekly event");
            return;
        }

        logger.info("Event scheduled successfully");
    },
};

function getNextDayOfWeek(date: Date, dayOfWeek: number) {
    const resultDate = new Date(date.getTime());
    resultDate.setDate(date.getDate() + ((7 + dayOfWeek - date.getDay()) % 7));

    return resultDate;
}

export {createWeeklyEventModule as cronJob};
