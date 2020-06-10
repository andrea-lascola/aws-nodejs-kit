import {jwtCreate, jwtDecode} from "../../src/auth";
import faker = require("faker");


describe("Jwt", () => {
    const secret = faker.random.alphaNumeric(10);

    describe("claim verify", () => {
        it("should verify deep obj", async () => {
            const obj = jwtCreate({"key": "value", another: {deep: "test"}},
                secret,
                60 * 60 * 24
            );

            expect(jwtDecode(obj, secret)).toBeTruthy();
        });
    });

    describe("extra fields verify", () => {
        it("should verify audience (exact string)", async () => {
            const obj = jwtCreate({"key": "value", another: {deep: "test"}},
                secret,
                60 * 60 * 24,
                {aud: ["aud1", "aud2"]});

            expect(jwtDecode(obj, secret, {audience: "aud1"})).toBeTruthy();
        });

        it("should verify issuer obj", async () => {

            const issuer = faker.random.alphaNumeric(10);
            const obj = jwtCreate({"key": "value", another: {deep: "test"}},
                secret,
                60 * 60 * 24,
                {iss: issuer});

            expect(jwtDecode(obj, secret, {issuer})).toBeTruthy();
        });
    });

});
