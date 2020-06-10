import {catchErrors, Lambda, validateDTO} from "../src/core";
import {Logger} from "../src/log";


/**
 * Classic handler with business logic
 * @param event
 */
const handler = async (event: any) => {
    console.log(event);
};

/**
 * Input Dto example
 */
class Dto {

    private constructor(public name: string) {
    }

    static fromEvent(event: any) {
        return new Dto(event.name);
    }
}

// class-validator "validate" function
export const validate = () => {
};

// export a lambda Handler using handler
export const lambdaHandler = new Lambda(handler)
// Catching Errors and mapping them to appropriate status codes
    .with(catchErrors(Logger.getInstance()))

    // Validate input Dto using class-validator
    .with(validateDTO(
        Logger.getInstance(),
        (event) => Dto.fromEvent(event),
        validate))
    // Applying Middlewares
    .toFn();
