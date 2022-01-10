export class NotImplementedError extends Error {

}
export class UseCaseError extends Error {

}

export class UnAuthorizedError extends Error {

}

export class ConflictError extends Error {

}

export class ValidationError extends Error {

    payload: any;

    constructor(message: string, payload: any = {}) {
        super(message);
        this.payload = payload;
    }
}

export class NotFoundError extends Error {

}

export type RestMetadata = {
    url: string;
    method: string;
    params: { [name: string]: any };
    statusCode: number;
    statusText: number;
};

export class IntegrationError extends Error {
    restMetadata?: RestMetadata;

    constructor(message: string, restMetadata?: RestMetadata) {
        super(message);
        this.restMetadata = restMetadata;
    }
}

/**
 *
 * @param object
 * @param name
 * @param location
 */
export const verified = <T>(object: T, name: string, location?: "querystring" | "body" | "headers"): T => {
    if (typeof object === "undefined" || object === null) {
        throw new ValidationError(`Missing input Parameter: ${name}`, {location});
    }
    return object;
};

/**
 * Decorator: CatchExceptionAndThrowIntegrationError
 * used when there is an interaction with a third party.
 *
 * @hint: if you need axios probably you need this
 *
 * @constructor
 */
export const CatchExceptionAndThrowIntegrationError = () => {
    return (target: any, methodName: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>) => {
        const method = descriptor.value; // save a reference to the original method
        descriptor.value = async function () {

            try {
                let result;
                result = await method!.apply(this, arguments as any);
                return result;
            } catch (e) {
                if (e.isAxiosError) {
                    throw new IntegrationError(e.message, {
                        method: e.config.method,
                        params: e.config.params,
                        statusCode: e.response.status,
                        statusText: e.response.statusText,
                        url: e.config.url
                    });
                } else {
                    throw new IntegrationError(e.message);
                }
            }
        };
        return descriptor;
    };
};

/**
 * Decorator: CatchExceptionAndThrowUseCaseError
 * used for the error handling in Use Cases
 *
 * @hint: if you are using a UseCase probably you need this
 * @constructor
 */
export const CatchExceptionAndThrowUseCaseError = () => {
    return (target: any, methodName: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>) => {
        const method = descriptor.value; // save a reference to the original method
        descriptor.value = async function () {

            try {
                let result;
                result = await method!.apply(this, arguments as any);
                return result;
            } catch (e) {
                if (e instanceof ConflictError) {
                    throw new ConflictError();
                }
                throw new UseCaseError(e.message);
            }

        };
        return descriptor;
    };
};
