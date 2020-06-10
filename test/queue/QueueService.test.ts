import faker = require("faker");
import {QueueService} from "../../src/queue";
import {MockLogger} from "../../src/__mocks__";


describe("QueueService", () => {
    it("should create service", async () => {
        const q = new QueueService(
            new MockLogger(),
            ""
        );
        expect(q).toBeTruthy();
    });

    it("should sendMessage", async () => {

        const queue = {
            sendMessage: () => ({
                promise: async () => {
                }
            })
        };
        const q = new QueueService(
            new MockLogger(),
            "",
            queue as any
        );

        const payload = {
            key: faker.random.alphaNumeric(10)
        };

        await q.sendMessage(payload);
        expect(true).toBeTruthy();
    });
});
