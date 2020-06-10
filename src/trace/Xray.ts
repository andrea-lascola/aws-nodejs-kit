//
// /**
//  * Decorator for adding a subsegment of a function using Aws X-ray
//  * TODO: this decorator DOES NOT WORK, have to investigate why as it seems that the syntax is right but the trace
//  * TODO: does not appear in AWS X-RAY
//  * @param name function name
//  * @param namespace
//  */
// export const XRayTrace = (name?: string, namespace?: string) => {
//     return (target: any, methodName: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>) => {
//         const method = descriptor.value; // save a reference to the original method
//         descriptor.value = async function () {
//             namespace = namespace || "docebo"; // Default namespace if not passed
//             name = name || methodName;
//             let result;
//
//             // before
//             const segment = AWSXRay.getSegment();
//             const subSegment = segment.addNewSubsegment(name);
//             subSegment.addAnnotation("namespace", namespace);
//
//             // execution
//             result = await method!.apply(this, arguments as any);
//
//             // after
//             subSegment.close();
//             return result;
//         };
//         return descriptor;
//     };
// };


// Enable X-Ray Tracing
import * as aws from "aws-sdk";

// const aws = require("aws-sdk");
const https = require("https");

const sslAgent = new https.Agent({
    keepAlive: true,
    maxSockets: 50,
    rejectUnauthorized: true
});
sslAgent.setMaxListeners(0);
aws.config.update({
    httpOptions: {
        agent: sslAgent
    }
});

export const AWS = aws;
