import {ConflictError, IntegrationError, NotFoundError, UseCaseError, ValidationError} from "./Exceptions";
import {ResponseBuilder} from "../http";
import {ILogger} from "../log";
import {DTO} from "../Types";
import {APIGatewayProxyResult} from "aws-lambda";

export type Middleware = (event: any, next: any) => any;

/**
 * Validate a DTO and eventually raise a Validation Error ( if used with catchErrors mdw ) it provides a 400 status code response
 * @param logger: logger
 * @param dtoProvider: function that return a dto from an event(example: (event) => dto.fromEvent(event))
 * @param validate validation function: usually
 */
export const validateDTO = (logger: ILogger, dtoProvider: (event: any) => DTO, validate: any) => async (event: any, next: any) => {
    const errors = await validate(
        dtoProvider(event)
    );

    if (errors.length > 0) {
        throw new ValidationError(
            "Validation Input Error",
            JSON.stringify(
                errors.map((e: any) => e.constraints)
            )
        );
    }

    return next();
};

/**
 * Catch Standard Errors
 * @param logger: logger
 * @param headers: headers
 */
export const catchErrors = (logger: ILogger, headers: { [name: string]: string } = {}) => async (event: any, next: any) => {
    try {
        return await next();
    } catch (e) {
        logger.error(`ERROR - ${e.name} - ${e.message}`, e, `event: ${JSON.stringify(event)}`);

        // Log stack trace
        logger.debug(e.stack);

        if (e instanceof ValidationError) {
            return new ResponseBuilder().setHeaders(headers).build().resBadReq(e.payload, "", e.message);
        } else if (e instanceof NotFoundError) {
            return new ResponseBuilder().setHeaders(headers).build().resNotFound({}, "", e.message);
        } else if (e instanceof UseCaseError) {
            return new ResponseBuilder().setHeaders(headers).build().resUseCaseError({}, "", e.message);
        } else if (e instanceof IntegrationError) {
            return new ResponseBuilder().setHeaders(headers).build().resIntegrationError({}, "", e.message);
        } else if (e instanceof ConflictError) {
            return new ResponseBuilder().setHeaders(headers).build().resConflictError({}, "", e.message);
        }
        return new ResponseBuilder().setHeaders(headers).build().resError({}, "", e.message);
    }
};

/**
 * Log event at the beginning
 * @param logger
 */
export const logEvent = (logger: ILogger) => async (event: any, next: any) => {
    logger.info(`Starting with event: ${JSON.stringify(event)}`);
    return await next();
};

/**
 * Log Api response data at the beginning
 * @param logger
 */
export const logResponse = (logger: ILogger) => async (event: any, next: any) => {
    const response: APIGatewayProxyResult = await next();
    logger.info(`Response statusCode:${response.statusCode} ` + (response.statusCode > 299 ? `Error:${JSON.stringify(response.body)}` : ``));
    return response;
};
