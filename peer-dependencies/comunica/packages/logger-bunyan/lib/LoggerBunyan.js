"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerBunyan = void 0;
const core_1 = require("@comunica/core");
const bunyan_1 = __importDefault(require("bunyan"));
/**
 * A bunyan-based logger implementation.
 */
class LoggerBunyan extends core_1.Logger {
    constructor(args) {
        super();
        args.streams = args.streamProviders.map(provider => provider.createStream());
        this.bunyanLogger = bunyan_1.default.createLogger(args);
    }
    fatal(message, data) {
        this.bunyanLogger.fatal(data, message);
    }
    error(message, data) {
        this.bunyanLogger.error(data, message);
    }
    warn(message, data) {
        this.bunyanLogger.warn(data, message);
    }
    info(message, data) {
        this.bunyanLogger.info(data, message);
    }
    debug(message, data) {
        this.bunyanLogger.debug(data, message);
    }
    trace(message, data) {
        this.bunyanLogger.trace(data, message);
    }
}
exports.LoggerBunyan = LoggerBunyan;
//# sourceMappingURL=LoggerBunyan.js.map