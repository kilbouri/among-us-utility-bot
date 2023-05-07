/**
 * A collection of frequently used strings for error messages.
 */
export const ErrorStrings = {
    unknownError: {
        short: "Oops!",
        detail: "We ran into an issue. Contact an administrator if the issue persists.",
    },
    unknownCommand: {
        short: "Unknown Command",
        detail: "The specified command is not recognized.",
    },
    unknownSubcommand: {
        short: "Unknown Subcommand",
        detail: "The specified subcommand is not recognized.",
    },
} as const;
