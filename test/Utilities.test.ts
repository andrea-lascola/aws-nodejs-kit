import {isApiGwEvent} from "../src";
import faker = require("faker");


describe("Utilities", () => {
    describe("Api Gw", () => {
        it("obj is not apiGW event", async () => {
            expect(isApiGwEvent({})).not.toBeTruthy();
        });

        it("obj is not apiGW event2", async () => {
            expect(isApiGwEvent({
                action: faker.random.alphaNumeric(),
                method: "GET"
            })).not.toBeTruthy();
        });

        it("obj is an apiGW event", async () => {
            expect(isApiGwEvent({
                body: "",
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                isBase64Encoded: false,
                resource: "/subscription",
                path: "/users/1/subscription",
                httpMethod: "GET",
                queryStringParameters: {},
                pathParameters: {},
                stageVariables: {},
                headers: {},
                requestContext: {
                    accountId: "123456789012",
                    resourceId: "123456",
                    stage: "dev",
                    requestId: "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
                    requestTime: "09/Apr/2015:12:34:56 +0000",
                    requestTimeEpoch: 1428582896000,
                    identity: {
                        "cognitoIdentityPoolId": null,
                        "accountId": null,
                        "cognitoIdentityId": null,
                        "caller": null,
                        "accessKey": null,
                        "sourceIp": "127.0.0.1",
                        "cognitoAuthenticationType": null,
                        "cognitoAuthenticationProvider": null,
                        "userArn": null,
                        "userAgent": "Custom User Agent String",
                        "user": null,
                        "apiKey": null,
                        "apiKeyId": null,
                    },
                    path: "/prod/path/to/resource",
                    resourcePath: "/{proxy+}",
                    httpMethod: "GET",
                    apiId: "1234567890"
                }
            })).toBeTruthy();
        });
    });
});
