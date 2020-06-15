![Release](https://github.com/andrea-lascola/aws-nodejs-kit/workflows/Release/badge.svg)

# Aws Nodejs Kit

This is a collection of generic typescript utilities to use in an aws lambda powered environment

Table of Contents
=================
  * [Installation](#installation)
  * [Usage / Reference](#usage--reference)
     * [NodeJS / Typescript utilities](#nodejs--typescript-utilities)
        * [Monads](#monads)
        * [Logger](#logger)
        * [Logging Decorators](#logging-decorators)
        * [Dates](#dates)
        * [Exceptions](#exceptions)
     * [AWS Helpers](#aws-helpers)
        * [Lambda Core](#lambda-core)
        * [Lambda Middlewares](#lambda-middlewares)
        * [DynamoDb](#dynamodb)
        * [Api Gateway](#api-gateway)
  * [Contributing](#contributing)

## Installation

npm page: https://www.npmjs.com/package/aws-nodejs-kit

    npm i aws-nodejs-kit 

## Usage / Reference

Please refer to the _/examples_ folder 

### NodeJS / Typescript utilities

#### Monads
```typescript
import {Optional} from "aws-nodejs-kit";

const value: number | undefined = 10;

// Perform a list of computation without having to check explicitly for null/undefined value
const compute = Optional.fromValue(value)
    .map((val: number) => val + 10)
    .map((val: number) => val * 2)
    // Get the internal value, you can actually apply a default if the value is undefined
    .getOrElse(10);

console.log(compute); // 40
```

#### Logger
```typescript
import {Logger} from "aws-nodejs-kit";

// Static Logger
const log = Logger.getInstance();

// Standard logs
log.debug("debug");
log.info("info");
log.warn("warn");
log.error("error");


// Log performance
log.time("log");
log.timeEnd("log");
```

#### Logging Decorators
```typescript
import {CatchExceptionAndThrowIntegrationError} from "aws-nodejs-kit";
import {LogMetric, LogMetricSync} from "aws-nodejs-kit";

class Service {

    // Log Metric for async functions
    // This will result in the following log row:
    // METRIC 1021.351594000007 milliseconds getFeedByName feeds
    @LogMetric("getFeedByName", "feeds")
    public async getFeedByName() {

    }

    // Log Metric for sync functions
    // This will result in the following log row:
    // METRIC 1021.351594000007 milliseconds getFeedById feeds
    @LogMetricSync("getFeedById", "feeds")
    public getFeedById() {

    }

    // Catch errors for async functions
    // throw an IntegrationError, that, if used in conjuction with "catchErrors" Middleware generate a 429 http error
    // Used to propagate an integration error
    @CatchExceptionAndThrowIntegrationError()
    public async getFeedFromExternal() {

    }
}
```

#### Dates
```typescript
import {dates} from "aws-nodejs-kit";

dates.datePlusTimeframe(new Date(), 1, dates.TimeUnit.hours);
// 2020-06-15T20:38:14.953Z

dates.dateFromISO(new Date().toISOString());
// 2020-06-15T19:38:14.956Z

dates.dateInHyphens(new Date());
// 2020-06-15

dates.dateInSeconds(new Date());
// 1592249894

dates.dateMinusTimeframe(new Date, 1, dates.TimeUnit.hours);
// 2020-06-15T18:38:14.960Z

dates.isDateGreaterThan(new Date(), 1, dates.TimeUnit.hours);
// true

dates.iSOFromTimestamp(new Date().getTime());
// 2020-06-15T19:41:11.301Z

dates.timestampFromISO(new Date().toISOString());
// 1592250071303

dates.timeframeToSeconds({amount: 1, timeUnit: dates.TimeUnit.hours});
// 3600
```

#### Exceptions
```typescript
import {
    ValidationError,        // Maps to a 400 Status code
    UseCaseError,           // Maps to a 422 Status code
    IntegrationError,       // Maps to a 429 Status code
    NotFoundError,          // Maps to a 400 Status code
    UnAuthorizedError,      // Maps to a 401 Status code
    NotImplementedError,    // Used for abstract classes
} from "aws-nodejs-kit";
```


### AWS Helpers

#### Lambda Core
```typescript
import {catchErrors, Lambda} from "aws-nodejs-kit";
import {Logger} from "aws-nodejs-kit";
/**
 * Classic handler with business logic
 * @param event
 */
const handler = async (event: any) => {
    console.log(event);
};

// export a lambda Handler using handler
export const lambdaHandler = new Lambda(handler)
    // Add any middleware you need, this one catch errors and respond with standard api gateway responses
    .with(catchErrors(Logger.getInstance()))
    // Applying Middlewares
    .toFn();
```

#### Lambda Middlewares
```typescript
// --- Default Middlewares includes:

// Log Lambda input event
.with(logEvent(Logger.getInstance()))

// Log Lambda response
.with(logResponse(Logger.getInstance()))

// Catch errors globally and return a apigw compatible response (map exceptions to status codes)
.with(catchErrors(Logger.getInstance()))

// Validate Lambda input event against a DTO (class decorated with "class-validator" decorators with static method "fromApiGWEvent")
// uses validate function to check- you should pass the "validator" function from "class-validator"  
.with(validateDTO(Logger.getInstance(),
    (event) => MyDTO.fromApiGWEvent(event),
    validate))

// You can create your custom Middleware implementing the "Middleware" type and passing your object to the .with() function
```

#### DynamoDb
```typescript
// TODO complete doc
```
#### Api Gateway
```typescript

import {ResponseBuilder} from "aws-nodejs-kit";

let handler;

/**
 * Return Api Gateway compatible responses
 * @param event
 */
handler = async (event: any) => {
    /**
     * http status code -> 200
     * response(enveloped) -> {
     *     data : {}
     * }
     */
    return new ResponseBuilder().build().resOk({data: {}});
    /**
     * http status code -> 204
     * response(enveloped) -> {
     *     data : {}
     * }
     * used mainly for POST/DELETE/PUT APIs
     */
    return new ResponseBuilder().build().resOkNoContent({data: {}});
};


/**
 * Return Bad Request responses:
 *
 * response(enveloped) -> {
 *      error: {
 *          errorMessage: errorMessage || "The request could not be understood by the server due to malformed syntax. The client should not repeat the request without modifications",
 *          errorCode: errorCode || "",
 *          payload
 *      }
 * }
 * @param event
 */
handler = async (event: any) => {
    /**
     * http status code -> 400
     */
    return new ResponseBuilder().build().resBadReq(
        {}, // optional payload,
        "xxx", // optional errorCode,
        "Invalid" // optional errorMessage,
    );
    /**
     * http status code -> 404
     * used for missing content
     */
    return new ResponseBuilder().build().resNotFound();
    /**
     * http status code -> 429
     * an error while communicating with a third party service happened
     */
    return new ResponseBuilder().build().resIntegrationError();
    /**
     * http status code -> 422
     * used for a business logic un-manageable error (better than a 500 aint'it?)
     */
    return new ResponseBuilder().build().resUseCaseError();
    /**
     * http status code -> 403
     * you are not allowed to see this content
     */
    return new ResponseBuilder().build().resForbidden();
};

```



## Contributing

    npm install
    npm run build
    npm run test
    npm run test:coverage // tests with coverage report

* PRs are welcome
* The release process uses github actions and **semantic-release** for automatic tagging/versioning/publishing to npm
* The commit messages MUST follow the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) convention 
