import {ResponseBuilder} from "../src/http";

let handler;

/**
 * Return Ok responses
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
    /**
     * http status code -> 409
     * conflicting resources
     */
     return new ResponseBuilder().build().resConflictError();
};
