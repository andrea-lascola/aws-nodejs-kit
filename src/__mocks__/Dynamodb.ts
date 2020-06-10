import {GetItemOutput, QueryOutput, ScanOutput} from "aws-sdk/clients/dynamodb";


namespace StandardResponses {
    export const get: GetItemOutput = {Item: undefined};
    export const query: QueryOutput = {Items: []};
    export const scan: ScanOutput = {Items: []};
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
    impl = {
        "get": jest.fn().mockResolvedValue(StandardResponses.get),
        "put": jest.fn(),
        "batchWrite": jest.fn(),
        "delete": jest.fn(),
        "query": jest.fn().mockResolvedValue(StandardResponses.query),
        "scan": jest.fn().mockResolvedValue(StandardResponses.scan),
        "transactWrite": jest.fn()
    };

    constructor() {
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
