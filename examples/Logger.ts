import {Logger} from "../src/log";

// Static Logger
const log = Logger.getInstance();

// Standard logs
log.debug("debug");
log.info("info");
log.warn("warn");
log.error("error");


// Log performance
log.time("log");
log.timeEnd("log");



