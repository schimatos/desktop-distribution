/**
 * A logger accepts messages from different levels
 * and emits them in a certain way.
 */
export declare abstract class Logger {
    /**
     * All available logging levels.
     * @type {{trace: number; debug: number; info: number; warn: number; error: number; fatal: number}}
     */
    static readonly LEVELS: Record<string, number>;
    /**
     * Convert a string-based logging level to a numerical logging level.
     * @param level A string-based logging level
     * @return The numerical logging level, or undefined.
     */
    static getLevelOrdinal(level: string): number;
    abstract trace(message: string, data?: any): void;
    abstract debug(message: string, data?: any): void;
    abstract info(message: string, data?: any): void;
    abstract warn(message: string, data?: any): void;
    abstract error(message: string, data?: any): void;
    abstract fatal(message: string, data?: any): void;
}
/**
 * @type {string} Context entry for a logger instance.
 * @value {Logger} A logger.
 */
export declare const KEY_CONTEXT_LOG = "@comunica/core:log";