import {CatchExceptionAndThrowIntegrationError} from "../src/core";
import {LogMetric, LogMetricSync} from "../src/log";

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
