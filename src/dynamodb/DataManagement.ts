import {dates} from "../core";
import {DynamoDBRecord} from "aws-lambda";

export type IPersisted<T extends {}> = T & {
    pk: string | number;
    sk: string | number;
    lastUpdated: string;
    ttl?: number;
};

export const cleaned = <T>(persisted: IPersisted<T>): T => {
    delete persisted.pk;
    delete persisted.sk;
    delete persisted.lastUpdated;
    delete persisted.ttl;
    return persisted;
};


export const ttl = (amount: number, unit: dates.TimeUnit): number => {
    return dates.dateInSeconds(dates.datePlusTimeframe(new Date(), amount, unit));
};


export const isExpiredRecord = (record: DynamoDBRecord): boolean => {
    if (record.eventName === "REMOVE" &&
        record.userIdentity &&
        record.userIdentity.type === "Service" &&
        record.userIdentity.principalId === "dynamodb.amazonaws.com") {
        return true;
    }
    return false;
};

export const isInsertedRecord = (record: DynamoDBRecord): boolean => {
    if (record.eventName === "INSERT") {
        return true;
    }
    return false;
};
