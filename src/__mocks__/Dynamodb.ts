import {
    GetItemOutput,
    QueryOutput,
    ScanOutput,
    PutItemOutput,
    BatchWriteItemOutput,
    TransactWriteItemsOutput,
    DeleteItemOutput
} from 'aws-sdk/clients/dynamodb';



namespace StandardResponses {
    export const get: GetItemOutput = {Item: undefined};
    export const put: PutItemOutput = {};
    export const query: QueryOutput = {Items: []};
    export const batchWrite: BatchWriteItemOutput = {};
    export const del: DeleteItemOutput = {Attributes: {}};
    export const scan: ScanOutput = {Items: []};
    export const transactWrite: TransactWriteItemsOutput = {};
}

type AvailableMethods =
    "get" |
    "put" |
    "query" |
    "batchWrite" |
    "delete" |
    "scan" |
    "transactWrite";

export class MockDynamoDb {
    impl: { [key: string]: jest.Mock } = {
        'get': jest.fn().mockResolvedValue(StandardResponses.get),
        'put': jest.fn().mockResolvedValue(StandardResponses.put),
        'query': jest.fn().mockResolvedValue(StandardResponses.query),
        'batchWrite': jest.fn().mockResolvedValue(StandardResponses.batchWrite),
        'delete': jest.fn().mockResolvedValue(StandardResponses.del),
        'scan': jest.fn().mockResolvedValue(StandardResponses.scan),
        'transactWrite': jest.fn().mockResolvedValue(StandardResponses.transactWrite)
    };

    /**
     * Mock constructor, optionally override default Available Methods
     * @param mockFunctions: override default responses, example:
     *
     *    new MockDynamoDb({get: jest.fn().mockResolvedValue({Item: {}})});
     *
     */
    constructor(mockFunctions: { [method in AvailableMethods]?: jest.Mock } = {}) {
        for (const [method, impl] of Object.entries(mockFunctions)) {
            if (impl) {
                this.impl[method] = impl;
            }
        }
    }

    overrideImpl(method: AvailableMethods, impl: any) {
        this.impl[method] = impl;
        return this;
    }

    get() {
        return {
            promise: this.impl["get"]
        };
    }

    delete() {
        return {
            promise: this.impl["delete"]
        };
    }

    query() {
        return {
            promise: this.impl["query"]
        };
    }

    batchWrite() {
        return {
            promise: this.impl["batchWrite"]
        };
    }

    put() {
        return {
            promise: this.impl["delete"]
        };
    }

    scan() {
        return {
            promise: this.impl["scan"]
        };
    }

    transactWrite() {
        return {
            promise: this.impl["transactWrite"]
        };
    }
}
