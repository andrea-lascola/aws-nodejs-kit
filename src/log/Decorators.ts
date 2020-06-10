import {ILogger, Logger} from "./Logger";
import {performance} from "perf_hooks";

/**
 * Log method decorator
 * @param target target function
 * @param methodName methodName
 * @param descriptor
 */
export const Log = (premessage?: string, postmessage?: string, logger?: ILogger): any => {
    return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
        const method = descriptor.value; // save a reference to the original method
        descriptor.value = function () {
            if (premessage) {
                (logger || Logger.getInstance()).log(premessage);
            }
            const result = method.apply(this, arguments);
            if (postmessage) {
                (logger || Logger.getInstance()).log(postmessage);
            }
            return result;
        };
        return descriptor;
    };
};

/**
 * Logs metric with the following pattern:
 *  METRIC $value $unit $name $namespace
 * example:
 *  METRIC 31.45342 milliseconds sso_latency namespace
 * @param logStart time before calling function
 * @param logEnd time after calling function
 * @param name function name
 * @param namespace
 * @param logger
 */
export const sendMetric = (logStart: number, logEnd: number, name: string, namespace: string, logger?: ILogger) => {
    (logger || Logger.getInstance()).info(`METRIC ${logEnd - logStart} milliseconds ${name} ${namespace}`);
};

/**
 * Log Metrics decorator for logging out perfrormance of async functions
 * @param name function name
 * @param namespace
 */
export const LogMetric = (name?: string, namespace?: string, logger?: ILogger) => {
    return (target: any, methodName: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>) => {
        const method = descriptor.value; // save a reference to the original method
        descriptor.value = async function () {
            namespace = namespace || "docebo"; // Default namespace if not passed
            name = name || methodName;
            let result;

            const logStart = performance.now();
            result = await method!.apply(this, arguments as any);
            const logEnd = performance.now();
            sendMetric(logStart, logEnd, name, namespace, logger);
            return result;
        };
        return descriptor;
    };
};

/**
 * Log Metrics decorator for logging out perfrormance of sync functions
 * @param name function name
 * @param namespace
 */
export const LogMetricSync = (name?: string, namespace?: string, logger?: ILogger) => {
    return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
        const method = descriptor.value; // save a reference to the original method
        descriptor.value = function () {
            namespace = namespace || "videoplatform";
            name = name || methodName;
            let result;

            const logStart = performance.now();
            result = method.apply(this, arguments);
            const logEnd = performance.now();
            sendMetric(logStart, logEnd, name, namespace, logger);
            return result;
        };
        return descriptor;
    };
};
