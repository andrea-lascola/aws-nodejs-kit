import {encrypt} from "../../src/auth";

describe("AESEncryption", () => {

    describe("Encryption", () => {

        it("should encrypt with 'aes-256-cbc' by default", async () => {
            const encrypted = encrypt("test", "secret");
            expect(encrypted).toBe("dfbe68c5440222872fc660b902dfabbc");
        });

    });
});
