import {HttpStatusCode} from "./HttpStatusCodes";
import {APIGatewayProxyResult} from "aws-lambda";

export class ResponseBuilder {
    private headers: { [name: string]: string } = {};

    setHeader(name: string, value: string) {
        this.headers[name] = value;
        return this;
    }

    setHeaders(headers: { [name: string]: string }) {
        this.headers = {...this.headers, ...headers};
        return this;
    }

    get Headers() {
        return this.headers;
    }

    build() {
        return new Response(this);
    }
}


export class Response {
    private readonly headers: { [name: string]: string } = {};

    constructor(builder: ResponseBuilder) {
        this.headers = builder.Headers;
    }

    /**
     * Response Ok -> 200
     * @param data Data
     * @param jsonp Jsonp Callback
     */
    resOk(data: IEnvelopedResponse | IResponse, jsonp?: string): APIGatewayProxyResult {
        let retData = JSON.stringify(data);

        if (jsonp) {
            retData = jsonp + `(${retData})`;
        }

        return {
            body: retData,
            headers: this.headers,
            statusCode: HttpStatusCode.OK
        };
    }

    /**
     * Response Ok Created -> 201
     * @param data input Data
     * @param jsonp jsonp callback
     */
    resOkCreated(data: IEnvelopedResponse | IResponse, jsonp?: string): APIGatewayProxyResult {
        let retData = JSON.stringify(data);

        if (jsonp) {
            retData = jsonp + `(${retData})`;
        }

        return {
            body: retData,
            headers: this.headers,
            statusCode: HttpStatusCode.CREATED
        };
    }

    /**
     * Response Ok -> 204
     * @param data input Data
     * @param jsonp jsonp callback
     */
    resOkNoContent(data: IEnvelopedResponse | IResponse, jsonp?: string): APIGatewayProxyResult {
        let retData = JSON.stringify(data);

        if (jsonp) {
            retData = jsonp + `(${retData})`;
        }

        return {
            body: retData,
            headers: this.headers,
            statusCode: HttpStatusCode.NO_CONTENT
        };
    }

    /**
     * Response KO -> 400
     * @param payload response message
     * @param errorCode error code
     * @param errorMessage error string message
     */
    resBadReq(payload?: any, errorCode?: string, errorMessage?: string): APIGatewayProxyResult {

        const response: IEnvelopedErrorResponse = {
            error: {
                errorMessage: errorMessage || "The request could not be understood by the server due to malformed syntax. The client should not repeat the request without modifications",
                errorCode: errorCode || "",
                payload
            }
        };

        return {
            body: JSON.stringify(response),
            headers: this.headers,
            statusCode: HttpStatusCode.BAD_REQUEST
        };
    }

    /**
     * Response KO -> 500
     * @param payload - Unused - do not propagate errors
     * @param errorCode error code
     * @param errorMessage error string message
     */
    resError(payload?: any, errorCode?: string, errorMessage?: string): APIGatewayProxyResult {
        const response: IEnvelopedErrorResponse = {
            error: {
                errorMessage: errorMessage || "Internal Server Error",
                errorCode: errorCode || "",
                payload
            }
        };
        return {
            body: JSON.stringify(response),
            headers: this.headers,
            statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
        };
    }

    /**
     * Response KO -> 422 Unprocessable entity
     * @param payload - Unused - do not propagate errors
     * @param errorCode error code
     * @param errorMessage error string message
     */
    resUseCaseError(payload?: any, errorCode?: string, errorMessage?: string): APIGatewayProxyResult {
        const response: IEnvelopedErrorResponse = {
            error: {
                errorMessage: errorMessage || "Use Case Error",
                errorCode: errorCode || "",
                payload
            }
        };
        return {
            body: JSON.stringify(response),
            headers: this.headers,
            statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY
        };
    }

    /**
     * Response KO -> 424 Integration Error
     * @param payload - payload metadata
     * @param errorCode error code
     * @param errorMessage error string message
     */
    resIntegrationError(payload?: any, errorCode?: string, errorMessage?: string): APIGatewayProxyResult {
        const response: IEnvelopedErrorResponse = {
            error: {
                errorMessage: errorMessage || "Integration Error",
                errorCode: errorCode || "",
                payload
            }
        };
        return {
            body: JSON.stringify(response),
            headers: this.headers,
            statusCode: HttpStatusCode.FAILED_DEPENDENCY
        };
    }

    /**
     * Response KO -> 403
     * @param payload - error payload
     * @param errorCode error code
     * @param errorMessage error string message
     */
    resForbidden(payload?: any, errorCode?: string, errorMessage?: string): APIGatewayProxyResult {
        const response: IEnvelopedErrorResponse = {
            error: {
                errorMessage: errorMessage || "You don't have permission to access / on this server.",
                errorCode: errorCode || "",
                payload
            }
        };

        return {
            body: JSON.stringify(response),
            headers: this.headers,
            statusCode: HttpStatusCode.FORBIDDEN
        };
    }

    /**
     * Response KO -> 409
     * @param payload - error payload
     * @param errorCode error code
     * @param errorMessage error string message
     */
    resConflictError(payload?: any, errorCode?: string, errorMessage?: string): APIGatewayProxyResult {
        const response: IEnvelopedErrorResponse = {
            error: {
                errorMessage: errorMessage || "Another object with the same id exists.",
                errorCode: errorCode || "",
                payload
            }
        };

        return {
            body: JSON.stringify(response),
            headers: this.headers,
            statusCode: HttpStatusCode.CONFLICT
        };
    }


    /**
     * Response NOT FOUND -> 404
     * @param payload - error payload
     * @param errorCode error code
     * @param errorMessage error string message
     */
    resNotFound(payload?: any, errorCode?: string, errorMessage?: string): APIGatewayProxyResult {
        const response: IEnvelopedErrorResponse = {
            error: {
                errorMessage: errorMessage || "Not Found",
                errorCode: errorCode || "",
                payload
            }
        };
        return {
            body: JSON.stringify(response),
            headers: this.headers,
            statusCode: HttpStatusCode.NOT_FOUND
        };
    }

    /**
     * Response Unauthorized -> 401
     * @param payload - error payload
     * @param errorCode error code
     * @param errorMessage error string message
     */
    resUnauthorized(payload?: any, errorCode?: string, errorMessage?: string): APIGatewayProxyResult {
        const response: IEnvelopedErrorResponse = {
            error: {
                errorMessage: errorMessage || "Not Found",
                errorCode: errorCode || "",
                payload
            }
        };
        return {
            body: JSON.stringify(response),
            headers: this.headers,
            statusCode: HttpStatusCode.UNAUTHORIZED
        };
    }
}

type IResponse = any;

type IEnvelopedResponse = {
    data: IResponse;
};

type IErrorBody = {
    errorMessage: string,
    errorCode: string,
    payload: object | string
};

type IEnvelopedErrorResponse = {
    error: IErrorBody
};
