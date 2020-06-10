import {Logger as logger} from "../../src";


describe("Utilities", () => {
    const Logger = logger.getInstance();

    describe("Logger", () => {
        it("should log at trace", async () => {
            expect(() => Logger.trace()).not.toThrowError();
        });
        it("should log at debug", async () => {
            expect(() => Logger.debug()).not.toThrowError();
        });
        it("should log at info", async () => {
            expect(() => Logger.info()).not.toThrowError();
        });
        it("should log at warn", async () => {
            expect(() => Logger.warn()).not.toThrowError();
        });
        it("should log at error", async () => {
            expect(() => Logger.error()).not.toThrowError();
        });

        it("should log time", async () => {
            expect(() => Logger.time("msg")).not.toThrowError();
        });
        it("should log timeEnd", async () => {
            expect(() => Logger.timeEnd("msg")).not.toThrowError();
        });
        it("should log logError", async () => {
            expect(() => Logger.logError("name", true, true)).not.toThrowError();
        });
    });
});
