import {Lambda} from "../../src/core";


// Mock lambda handlers
const mockHandlerOk = (event: any, context: any, callback: any) => {
    return event.body;
};
const mockHandlerThrow = (event: any, context: any, callback: any) => {
    throw new Error("Exec fail");
    return event.body;
};

// Mock Engine Middleware
const mockPassMdw = (event: any, next: any) => {
    return next();
};
const mockModMdw = (event: any, next: any) => {
    event.body = "xxx";
    return next();
};
const mockReadMdw = (event: any, next: any) => {
    if (event.body !== "123") {
        throw Error("Cannot read event input");
    }
    return next();
};
const mockCatchMdw = (event: any, next: any) => {
    try {
        return next();
    } catch (e) {
        return null;
    }
};

describe("Lambda Middleware Engine", () => {

    const event = {body: "123"};
    it("Should be able to retrieve result", async () => {
        const lambdaHandler = new Lambda(mockHandlerOk)
            .with(mockPassMdw)
            .with(mockPassMdw)
            .toFn();

        const event = {body: "123"};
        const value = lambdaHandler(event);
        expect(value).toEqual(event.body);
    });

    it("Should not modify event data", async () => {
        const lambdaHandler = new Lambda(mockHandlerOk)
            .with(mockModMdw)
            .toFn();

        const event = {body: "123"};
        const value = lambdaHandler(event);
        expect(value).toEqual(event.body);
    });
    it("Should be able to read Data", async () => {
        const lambdaHandler = new Lambda(mockHandlerOk)
            .with(mockPassMdw)
            .with(mockReadMdw)
            .with(mockPassMdw)
            .toFn();

        const exec = jest.fn(() => lambdaHandler(event));
        exec();
        expect(exec).toHaveReturned();
    });

    it("Should be able catch Errors", async () => {
        const lambdaHandler = new Lambda(mockHandlerThrow)
            .with(mockPassMdw)
            .with(mockCatchMdw)
            .with(mockPassMdw)
            .toFn();

        const exec = jest.fn(() => lambdaHandler(event));
        exec();
        expect(exec).toHaveReturned();
    });
});



