import {ILogger} from "../log";

export class MockLogger implements ILogger {
    log(...args: any[]) {
    }

    trace(...args: any[]) {
    }

    debug(...args: any[]) {
    }

    info(...args: any[]) {
    }

    warn(...args: any[]) {
    }

    error(...args: any[]) {
    }

    // Performances Logging
    time(message: any) {
    }

    timeEnd(message: any) {
    }

    // Utils
    /**
     * Logs an Error with explicit tag, error name, message, and stack.
     *
     * @param error — Error to be logged.
     * @param explicit — Determines if passed Error was explicit (intended) or not.
     * @param trace
     */
    logError(error: any, trace: boolean = true, explicit: boolean = false) {
    }
}
