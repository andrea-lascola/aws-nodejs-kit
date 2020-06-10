import {Optional} from "../../src/core";

describe("Monads", () => {
    describe("Optional", () => {
        it("should not throw error from fromValue method", async () => {
            expect(() => Optional.fromValue("value")).not.toThrowError();
        });
        it("should get Default value with null", async () => {
            const value: string | null = null;
            const result = Optional.fromValue<string | null>(value)
                .getOrElse("default");
            expect(result).toEqual("default");
        });

        it("should get Default value after map on null", async () => {
            const value: string | null = null;
            const result = Optional.fromValue<string>(value)
                .map(val => val.toString())
                .getOrElse("default");
            expect(result).toEqual("default");
        });

        it("should get Default value after map on null", async () => {
            const value: string | null = null;
            const result = Optional.fromValue<string>(value)
                .map(val => val.toUpperCase())
                .getOrElse("default");
            expect(result).toEqual("default");
        });

        it("should apply map if not null", async () => {
            const value: string | null = "value";
            const result = Optional.fromValue<string>(value)
                .map(val => val.toUpperCase())
                .getOrElse("default");
            expect(result).toEqual("VALUE");
        });
    });
});
