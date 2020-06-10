import {getWebhookUrl} from "../../src";
import faker = require("faker");
import {URL} from "url";

describe("Webhooks", () => {
    describe("getWebhookUrl", () => {

        it("webhook contains token", async () => {

            const endpoint = faker.internet.url();

            const webhook = getWebhookUrl(
                endpoint,
                {},
                faker.random.alphaNumeric(10), {
                    expInSeconds: faker.random.number(10)
                });
            const url = new URL(webhook);
            expect(url.searchParams.get("token")).toBeTruthy();
        });
        it("webhook contains url", async () => {

            const endpoint = faker.internet.url();
            const webhook = getWebhookUrl(
                endpoint,
                {},
                faker.random.alphaNumeric(10), {
                    expInSeconds: faker.random.number(10)
                });
            expect(webhook.includes(endpoint)).toBeTruthy();
        });
    });
});
