import * as loglev from "loglevel";
import * as prefix from "loglevel-plugin-prefix";

prefix.reg(loglev);

prefix.apply(loglev, {
    template: "[%l]"
});

// trace/debug/info/warn/error
if (process.env.NODE_ENV === "test") {
    loglev.setDefaultLevel("error");
} else {
    loglev.setDefaultLevel((process.env.LOG_LEVEL as loglev.LogLevelDesc) || "trace");
}


export interface ILogger {
    log(...args: any[]): void;

    trace(...args: any[]): void;

    debug(...args: any[]): void;

    info(...args: any[]): void;

    warn(...args: any[]): void;

    error(...args: any[]): void;

    // Performances Logging
    time(message: any): void;

    timeEnd(message: any): void;

    // Utils
    /**
     * Logs an Error with explicit tag, error name, message, and stack.
     *
     * @param error — Error to be logged.
     * @param trace
     * @param explicit — Determines if passed Error was explicit (intended) or not.
     */
    logError(error: any, trace: boolean, explicit: boolean): void;
}

export class Logger implements ILogger {
    private static _logger: ILogger = new Logger();

    private constructor() {
    }

    public static getInstance(): ILogger {
        return Logger._logger;
    }

    // Simple logger just to wrap console object
    log(...args: any[]) {
        loglev.debug.apply(this, args);
    }

    trace(...args: any[]) {
        loglev.trace.apply(this, args);
    }

    debug(...args: any[]) {
        loglev.debug.apply(this, args);
    }

    info(...args: any[]) {
        loglev.info.apply(this, args);
    }

    warn(...args: any[]) {
        loglev.warn.apply(this, args);
    }

    error(...args: any[]) {
        loglev.error.apply(this, args);
    }

    // Performances Logging
    time(message: any) {
        console.time(message);
    }

    timeEnd(message: any) {
        console.timeEnd(message);
    }

    // Utils
    /**
     * Logs an Error with explicit tag, error name, message, and stack.
     *
     * @param error — Error to be logged.
     * @param trace
     * @param explicit — Determines if passed Error was explicit (intended) or not.
     */
    logError(error: any, trace: boolean = true, explicit: boolean = false) {
        const exceptionName = error.name || (error.constructor && error.constructor.name) || "UnknownException";

        this.error(`${explicit ? "[EXPLICIT] " : ""}<${exceptionName}>: ${error.message}`);
        if (trace && error.stack) {
            this.info(error.stack.slice(error.stack.indexOf("\n") + 1));
        }
    }
}
