import {APIGatewayProxyEvent} from "aws-lambda";

import {AWS} from "./trace";
import {IntegrationError} from "./core";


/**
 * Check if object is an APIGw proxy event
 * @param event
 */
export const isApiGwEvent = <T>(event: T | APIGatewayProxyEvent): event is APIGatewayProxyEvent => {
    return [
        (event as APIGatewayProxyEvent).queryStringParameters,
        (event as APIGatewayProxyEvent).resource,
        (event as APIGatewayProxyEvent).path
    ].every(x => x !== undefined);
};


export const invokeFunction = async <T>(functionName: string, input: string, sync: boolean = true): Promise<any> => {
    const response = await new AWS.Lambda({region: process.env.AWS_REGION}).invoke({
        FunctionName: functionName,
        Payload: input,
        InvocationType: sync ? "RequestResponse" : "Event"
    }).promise();

    if (sync) {
        if (!response || !response.StatusCode || !response.Payload) {
            throw new IntegrationError(`Undefined response from function: ${functionName}`);
        }

        if (response.StatusCode < 200 || response.StatusCode > 299) {
            throw new IntegrationError(`Error response from function: ${functionName}`);
        }

        return JSON.parse(response.Payload.toString());
    }
};
