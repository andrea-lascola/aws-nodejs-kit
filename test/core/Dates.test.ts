import {dates} from "../../src/core";


describe("Dates", () => {
    describe("ISO dates", () => {
        it("from ISO to Date", async () => {
            const date = dates.dateFromISO("2019-09-05T13:24:24.473Z");
            expect(date.getTime()).toBe(1567689864473);
        });

        it("from ISO to Timestamp", async () => {
            const date = dates.timestampFromISO("2019-09-05T13:24:24.473Z");
            expect(date).toBe(1567689864473);
        });

        it("from Timestamp to ISO", async () => {
            const date = dates.iSOFromTimestamp(1567689864473);
            expect(date).toBe("2019-09-05T13:24:24.473Z");
        });
    });


    describe("Compare", () => {
        it("Is Date Greater than", async () => {
            const res = dates.isDateGreaterThan(new Date(), 3, dates.TimeUnit.months);
            expect(res).toBeTruthy();
        });
    });

    describe("Dates operations", () => {
        it("Date minus timeframe works", async () => {
            const res = dates.dateMinusTimeframe(new Date(), 3, dates.TimeUnit.hours);
            expect(res < new Date()).toBeTruthy();
        });

        it("Date minus timeframe works for single values", async () => {
            const res = dates.dateMinusTimeframe(new Date(), 1, dates.TimeUnit.hours);
            expect(res < new Date()).toBeTruthy();
        });


        it("Date plus timeframe works", async () => {
            const res = dates.datePlusTimeframe(new Date(), 3, dates.TimeUnit.hours);
            expect(res > new Date()).toBeTruthy();
        });

        it("Date plus timeframe works for single values", async () => {
            const res = dates.datePlusTimeframe(new Date(), 1, dates.TimeUnit.hours);
            expect(res > new Date()).toBeTruthy();
        });
    });
});
