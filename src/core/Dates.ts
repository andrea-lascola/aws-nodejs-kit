import moment = require("moment");

export namespace dates {


    export enum TimeUnit {
        minutes = "minutes",
        months = "months",
        years = "years",
        days = "days",
        hours = "hours",
        seconds = "seconds"
    }

    export type TimeFrame = {
        amount: number;
        timeUnit: TimeUnit
    };


    // Dates comparison
    export const isDateGreaterThan = (date: Date, amount: number, unit: TimeUnit): boolean => {
        const referenceDate = dateMinusTimeframe(new Date(), amount, unit);
        return date > referenceDate;
    };

    // Dates shift
    export const dateMinusTimeframe = (date: Date, amount: number, unit: TimeUnit): Date => {
        return moment(date).subtract(amount, unit).toDate();
    };

    export const datePlusTimeframe = (date: Date, amount: number, unit: TimeUnit): Date => {
        return moment(date).add(amount, unit).toDate();
    };

    // Dates Conversions
    export const dateFromISO = (date: string): Date => {
        return moment(date).toDate();
    };

    export const timestampFromISO = (date: string): number => {
        return dateFromISO(date).getTime();
    };

    export const iSOFromTimestamp = (timestamp: number): string => {
        return new Date(timestamp).toISOString();
    };

    export const dateInSeconds = (date: Date): number => {
        return Math.floor(date.getTime() / 1000);
    };


    // Timeframe Operations
    const amountToSeconds = (amount: number) => ({
        "seconds": () => amount,
        "minutes": () => 60 * amount,
        "hours": () => 60 * 60 * amount,
        "days": () => 60 * 60 * 24 * amount,
        "months": () => 31 * 60 * 60 * 24 * amount,
        "years": () => 365 * 60 * 60 * 24 * amount,
    });

    /**
     * ex. 1-hours -> 3600
     * @param timeFrame
     */
    export const timeframeToSeconds = (timeFrame: TimeFrame): number => {
        return amountToSeconds(timeFrame.amount)[timeFrame.timeUnit]();
    };

    /**
     * date -> "2020-10-20"
     * @param date
     */
    export const dateInHyphens = (date: Date): string => {
        return moment(date).format("YYYY-MM-DD");
    };

}
