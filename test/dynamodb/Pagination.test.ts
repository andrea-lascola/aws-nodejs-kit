import {paginatedQuery, scanAllDynamodbItems} from "../../src/dynamodb";
import {MockDynamoDb, MockLogger} from "../../src/__mocks__";
import {QueryOutput, ScanOutput} from "aws-sdk/clients/dynamodb";
import * as faker from "faker";

describe("Dynamodb Pagination", () => {
    describe("paginated Query", () => {

        const db = new MockDynamoDb();


        const resultWithOtherElementsInDb = jest.fn().mockResolvedValue({
            Items: [{"pk": "1", "sk": "1"}, {"pk": "2", "sk": "2"},
                {"pk": "3", "sk": "3"}, {"pk": "4", "sk": "4"}],
            LastEvaluatedKey: {"pk": "4", "sk": "4"},
            Count: 4
        } as QueryOutput);


        const resultWithNoOtherElementsInDb = jest.fn().mockResolvedValue({
            Items: [{"pk": "1", "sk": "1"}, {"pk": "2", "sk": "2"},
                {"pk": "3", "sk": "3"}, {"pk": "4", "sk": "4"}],
            LastEvaluatedKey: undefined,
            Count: 4
        } as QueryOutput);


        beforeEach(() => {
            jest.clearAllMocks();
        });
        it("return the items and cursor", async () => {

            db.overrideImpl("query", resultWithOtherElementsInDb);

            const {items, cursor} = await paginatedQuery(
                new MockLogger(),
                db as any,
                {
                    TableName: faker.random.alphaNumeric(4)
                },
                ["pk", "sk"],
                2,
                100
            );

            expect(items.length).toBe(2);
            expect(cursor).toBeTruthy();
        });


        it("return the correct number of items and cursor when large items per page", async () => {

            db.overrideImpl("query", resultWithOtherElementsInDb);
            const {items, cursor} = await paginatedQuery(
                new MockLogger(),
                db as any,
                {
                    TableName: faker.random.alphaNumeric(4)
                },
                ["pk", "sk"],
                20,
                100
            );

            expect(items.length).toBe(20); // Continuously fetch until got 20 items
            expect(cursor).toBeTruthy();
        });


        it("should return the cursor undefined if i finish to fetch", async () => {

            db.overrideImpl("query", resultWithNoOtherElementsInDb);
            const {items, cursor} = await paginatedQuery(
                new MockLogger(),
                db as any,
                {
                    TableName: faker.random.alphaNumeric(4)
                },
                ["pk", "sk"],
                5,
                100
            );

            expect(items.length).toBe(4);
            expect(cursor).not.toBeTruthy();
        });

        it("should return the cursor filled if i have LastEvaluatedKey undefined but there are more results", async () => {

            db.overrideImpl("query", resultWithNoOtherElementsInDb);
            const {items, cursor} = await paginatedQuery(
                new MockLogger(),
                db as any,
                {
                    TableName: faker.random.alphaNumeric(4)
                },
                ["pk", "sk"],
                2,
                100
            );

            expect(items.length).toBe(2);
            expect(cursor).toBeTruthy();
        });
    });


    describe("scan all dynamo items", () => {

        const db = new MockDynamoDb();

        const result = jest.fn().mockResolvedValue({
            Items: [{"pk": "1", "sk": "1"},
                {"pk": "2", "sk": "2"},
                {"pk": "3", "sk": "3"},
                {"pk": "4", "sk": "4"}]
        } as ScanOutput);

        beforeEach(() => {
            jest.clearAllMocks();
        });
        it("return the items", async () => {

            db.overrideImpl("scan", result);

            const items = await scanAllDynamodbItems(
                new MockLogger(),
                db as any,
                faker.random.alphaNumeric(10)
            );

            expect(items.length).toBe(4);
        });


        it("execute callback fn", async () => {

            db.overrideImpl("scan", result);

            const callback = jest.fn();

            const res = await scanAllDynamodbItems(
                new MockLogger(),
                db as any,
                faker.random.alphaNumeric(10),
                (items) => callback(items)
            );

            expect(callback).toBeCalled();
            expect(res.length).toBe(0); // Should not return result (for large dataset)
        });
    });
});
