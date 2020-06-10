import {MockLogger} from "../../src";
import {catchErrors, NotFoundError, UseCaseError, validateDTO, ValidationError} from "../../src/core";
import {HttpStatusCode} from "../../src/http";
import {Dto} from "../__mocks__/Dto";


describe("Middlewares", () => {

    const logger = new MockLogger();
    const event = {body: "123"};

    describe("validateDTO", () => {
        it("Should be able to validate a DTO", async () => {

            const fn = validateDTO(new MockLogger(),
                (event: any) => Dto.fromEvent(event),
                () => {
                    return [
                        // return a fake list of errors
                        {constraints: {}},
                        {constraints: {}},
                    ];
                }
            );

            const check = async () => {
                await fn({}, () => {
                });
            };

            expect(check()).rejects.toThrow();
        });
        it("Should be able to validate a DTO", async () => {

            const fn = validateDTO(new MockLogger(),
                (event: any) => Dto.fromEvent(event),
                () => {
                    return [
                        // No errors in this case, validation should not raise error
                    ];
                }
            );

            return fn({}, () => {
            }).then(data => {
                // Just check that it does not throw
                expect(true).toBeTruthy();
            });

        });
    });
    describe("Catch Errors", () => {
        it("Should be able to catch Errors", async () => {

            const exec = jest.fn(() => catchErrors(logger)(
                event,
                () => {
                    throw new ValidationError("error");
                })
            );

            await exec();
            expect(exec).toHaveReturned();
        });
        it("Should be able to retrieve result when there is no error", async () => {

            const result = await catchErrors(logger)(
                event,
                () => event.body);
            expect(result).toEqual("123");
        });

        it("Should return 500 for common Errors", async () => {
            const result = await catchErrors(logger)(
                event,
                async () => {
                    throw new Error("error");
                });

            expect(result.statusCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
        });
        it("Should return 404 for Not found Errors", async () => {
            const result = await catchErrors(logger)(
                event,
                () => {
                    throw new NotFoundError("error");
                });
            expect(result.statusCode).toEqual(HttpStatusCode.NOT_FOUND);
        });
        it("Should return 400 for Validation Errors", async () => {
            const result = await catchErrors(logger)(
                event,
                () => {
                    throw new ValidationError("error");
                });
            expect(result.statusCode).toEqual(HttpStatusCode.BAD_REQUEST);
        });
        it("Should return 422 for a Use Case Error", async () => {
            const result = await catchErrors(logger)(
                event,
                () => {
                    throw new UseCaseError("error");
                });
            expect(result.statusCode).toEqual(HttpStatusCode.UNPROCESSABLE_ENTITY);
        });
    });
});



