import {cleaned, ttl, dates, isExpiredRecord} from "../../src";
import faker = require("faker");

describe("DataManagement", () => {

    describe("cleaned", () => {

        it("should clean obj", async () => {

            const obj = cleaned({
                pk: faker.random.alphaNumeric(10),
                sk: faker.random.alphaNumeric(10),
                lastUpdated: faker.random.alphaNumeric(10),
                ttl: new Date().getTime(),
                original: faker.random.words(1)
            });

            expect(obj).not.toHaveProperty("pk");
            expect(obj).not.toHaveProperty("ttl");

            expect(obj).toHaveProperty("original");
        });

    });

    describe("ttl", () => {
        it("should create ttl", async () => {
            const ttlField = ttl(1, dates.TimeUnit.months);

            expect(ttlField).toBeTruthy();
        });
    });

    describe("isExpiredRecord", () => {
        it("should detect expired record", async () => {
            const isExpired = isExpiredRecord({
                eventName: "REMOVE",
                userIdentity: {
                    type: "Service",
                    principalId: "dynamodb.amazonaws.com"
                }
            });

            expect(isExpired).toBeTruthy();
        });

        it("should detect not expired record", async () => {
            const isExpired = isExpiredRecord({
                eventName: "INSERT",
                userIdentity: {
                    type: "Service",
                    principalId: "dynamodb.amazonaws.com"
                }
            });

            expect(isExpired).not.toBeTruthy();
        });
    });
});
