import {
    ValidationError,        // Map to a 400 Status code
    UseCaseError,           // Map to a 422 Status code
    IntegrationError,       // Map to a 429 Status code
    NotFoundError,          // Map to a 400 Status code
    UnAuthorizedError,      // Map to a 401 Status code
    NotImplementedError,
} from "../src/core";