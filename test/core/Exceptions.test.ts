import {
    CatchExceptionAndThrowIntegrationError,
    CatchExceptionAndThrowUseCaseError,
    IntegrationError, UseCaseError, ValidationError, verified
} from "../../src/core";
import * as faker from "faker";


describe("Exceptions", () => {

    const response = faker.hacker.phrase();
    const error = faker.hacker.ingverb();

    class Ex {
        // Integration Error
        @CatchExceptionAndThrowIntegrationError()
        async methodThrow() {
            throw new Error(error);
        }

        @CatchExceptionAndThrowIntegrationError()
        async methodSuccess() {
            return response;
        }

        // Use Case Error
        @CatchExceptionAndThrowUseCaseError()
        async useCaseError() {
            throw new Error(error);
        }
    }

    describe("Integration Error Decorator", () => {
        it("Should propagate errors", async () => {

            const check = async () => {
                await new Ex().methodThrow();
            };

            expect(check()).rejects.toThrow();
        });
        it("Should propagate an integration error", async () => {
            const check = async () => {
                await new Ex().methodThrow();
            };

            expect(check()).rejects.toThrow(new IntegrationError(error));
        });
        it("Should return the correct value if no error is raised", async () => {
            expect(
                await new Ex().methodSuccess()
            ).toBe(response);
        });
    });

    describe("Use Case Error Decorator", () => {
        it("Should propagate a Use Case error", async () => {
            const check = async () => {
                await new Ex().useCaseError();
            };

            expect(check()).rejects.toThrow(new UseCaseError(error));
        });
    });


    describe("Validations", () => {

        it("Should verify null field", async () => {
            const obj = null;

            const check = () => {
                verified(obj, "object");
            };

            expect(check).toThrow(ValidationError);
        });

        it("Should verify undefined field", async () => {
            const obj = null;

            const check = () => {
                verified(obj, "object");
            };

            expect(check).toThrow(ValidationError);
        });


        it("Should return verified object", async () => {
            const obj = faker.random.alphaNumeric();

            const verifiedObj = verified(obj, "object");

            expect(verifiedObj).toBe(obj);
        });

    });
});
