import {ResponseBuilder} from "../../src";

const httpUtils = new ResponseBuilder().build();

describe("Utilities", () => {
    describe("Response Builder", () => {
        it("should set Headers", async () => {
            const http = new ResponseBuilder()
                .setHeader("x-test1", "value1")
                .setHeaders({"x-test2": "value2"})
                .build();

            const response = http.resOk({data: {}});

            expect(response.headers).toBeTruthy();
            expect(response.headers).toMatchObject({
                "x-test1": "value1",
                "x-test2": "value2",
            });
        });

    });


    describe("http responses", () => {
        describe("resOk function", () => {
            it("should return a non-null object", async () => {
                const response = httpUtils.resOk({data: {}});
                expect(response).toBeTruthy();
            });
            it("should return a valid response object", async () => {
                const res = httpUtils.resOk({data: "ciao"});

                expect(res).toBeTruthy();

                expect(res).toHaveProperty("body");
                expect(res).toHaveProperty("statusCode");
                expect(typeof res.body === "string").toBe(true);
            });
            it("should return an Ok-status response", async () => {
                const res = httpUtils.resOk({data: {}});
                expect(res.statusCode).toBeGreaterThanOrEqual(200);
                expect(res.statusCode).toBeLessThanOrEqual(299);
            });
            it("should return a stringify object from object", async () => {
                const response = httpUtils.resOk({data: {}});
                expect(typeof (response.body)).toBe("string");
            });
            it("should return a stringify object from string", async () => {
                const response = httpUtils.resOk({data: "test string response"});
                expect(typeof (response.body)).toBe("string");
            });
        });

        describe("resError function", () => {
            it("should return a non-null object", async () => {
                const res = httpUtils.resError({});
                expect(res).toBeTruthy();
            });
            it("should return a valid response object", async () => {
                const res = httpUtils.resError({});
                expect(res).toHaveProperty("body");
                expect(res).toHaveProperty("statusCode");
                expect(typeof res.body === "string").toBe(true);
            });
            it("should return an Error response", async () => {
                const res = httpUtils.resError({});
                expect(res.statusCode).toBeGreaterThanOrEqual(500);
                expect(res.statusCode).toBeLessThanOrEqual(599);
            });
        });

        describe("resIntegrationError function", () => {
            it("should return a non-null object", async () => {
                const res = httpUtils.resIntegrationError({});
                expect(res).toBeTruthy();
            });
        });
        describe("resForbidden function", () => {
            it("should return a non-null object", async () => {
                const res = httpUtils.resForbidden({});
                expect(res).toBeTruthy();
            });
        });
        describe("resBadReq function", () => {
            it("should return a non-null object", async () => {
                const res = httpUtils.resBadReq({});
                expect(res).toBeTruthy();
            });
            it("should return a valid response object", async () => {
                const res = httpUtils.resBadReq({});
                expect(res).toHaveProperty("body");
                expect(res).toHaveProperty("statusCode");
                expect(typeof res.body === "string").toBe(true);
            });
            it("should return an Error(BadReq) response", async () => {
                const res = httpUtils.resBadReq({});
                expect(res.statusCode).toBeGreaterThanOrEqual(400);
                expect(res.statusCode).toBeLessThanOrEqual(499);
            });
        });
    });
});
