import {APIGatewayProxyEvent, SNSEvent, SQSEvent, ScheduledEvent, CognitoUserPoolTriggerEvent} from "aws-lambda";
import faker = require("faker");

// Mock SNS Event
export type SNSEventOptional = { [key in keyof SNSEvent]?: SNSEvent[key] };
export const MockSNSSimpleEvent = (override: any = {}): SNSEvent => {
    return {
        ...{
            Records: [
                {
                    "EventSource": "aws:sns",
                    "EventVersion": "1.0",
                    "EventSubscriptionArn": "arn:aws:sns:us-east-1:123456789:service-1474781718017-1:fdaa4474-f0ff-4777-b1c4-79b96f5a504f",
                    "Sns": {
                        "Type": "Notification",
                        "MessageId": "52ed5e3d-5fgf-56bf-923d-0e5c3b503c2a",
                        "TopicArn": "arn:aws:sns:us-east-1:123456789:service-1474781718017-1",
                        "Subject": "",
                        "Message": "hello world",
                        "Timestamp": "2016-09-25T05:37:51.150Z",
                        "SignatureVersion": "1",
                        "Signature": "V5QL/dhow62Thr9PXYsoHA7bOsDFkLdWZVd8D6LyptA6mrq0Mvldvj/XNtai3VaPp84G3bD2nQbiuwYbYpu9u9uHZ3PFMAxIcugV0dkOGWmYgKxSjPApItIoAgZyeH0HzcXHPEUXXO5dVT987jZ4eelD4hYLqBwgulSsECO9UDCdCS0frexiBHRGoLbWpX+2Nf2AJAL+olEEAAgxfiPEJ6J1ArzfvTFZXdd4XLAbrQe+4OeYD2dw39GBzGXQZemWDKf4d52kk+SwXY1ngaR4UfExQ10lDpKyfBVkSwroaq0pzbWFaxT2xrKIr4sk2s78BsPk0NBi55xA4k1E4tr9Pg==",
                        "SigningCertUrl": "https://sns.us-east-1.amazonaws.com/SimpleNotificationService-b95095beb82e8f6a0e6b3aafc7f4149a.pem",
                        "UnsubscribeUrl": "https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:123456789:service-1474781718017-1:fdaa4474-f0ff-4777-b1c4-79b96f5a504f",
                        "MessageAttributes": {}
                    }
                }]
        }, ...override
    };
};

// Generic Mock API Gateway
export const MockApiGW = (override: any = {}): APIGatewayProxyEvent => {
    return {
        ...{
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
        }, ...override
    };
};

export const MockSQSEvent = <T>(bodiesOverride: T[]): SQSEvent => {

    bodiesOverride = bodiesOverride || [
        {message: faker.random.alphaNumeric(10)},
        {message: faker.random.alphaNumeric(10)},
    ];

    return {
        Records: bodiesOverride.map((body: T) => ({
                messageId: faker.random.uuid(),
                receiptHandle: faker.random.alphaNumeric(20),
                body: JSON.stringify(body),
                attributes: {
                    ApproximateReceiveCount: faker.random.number(100).toString(),
                    SentTimestamp: faker.date.recent().getTime().toString(),
                    SenderId: faker.random.alphaNumeric(50),
                    ApproximateFirstReceiveTimestamp: faker.date.recent().getTime().toString()
                },
                messageAttributes: {},
                md5OfBody: faker.random.alphaNumeric(32),
                eventSource: "aws:sqs",
                eventSourceARN: `arn:aws:sqs:us-east-1:${faker.random.alphaNumeric(30)}`,
                awsRegion: "us-east-1",
            })
        )
    };
};

export const MockCognitoUserPoolTriggerEvent = (override: {
    userName?: string,
    userPoolId?: string,
} = {}): CognitoUserPoolTriggerEvent => {
    const obj: CognitoUserPoolTriggerEvent = {
        version: 111,
        region: "us-east-1",
        userPoolId: override.userPoolId ? override.userPoolId : faker.random.alphaNumeric(10),
        userName: override.userName,
        callerContext: {
            awsSdkVersion: "xxx",
            clientId: "xxx"
        },
        request: {
            userAttributes: {name: "Test"}
        },
        response: {},
        triggerSource: "PreSignUp_SignUp"
    };
    return obj;
};

export const MockScheduledEvent = (override?: any): ScheduledEvent => {
    return {
        version: faker.random.alphaNumeric(3),
        account: faker.random.alphaNumeric(10),
        region: "us-east-1",
        detail: {},
        "detail-type": "Scheduled Event",
        source: faker.random.alphaNumeric(10),
        time: faker.date.recent().toISOString(),
        id: faker.random.alphaNumeric(10),
        resources: [faker.random.alphaNumeric(10), faker.random.alphaNumeric(10)]
    };
};

