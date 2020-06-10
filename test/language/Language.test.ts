import {parseISOLang} from "../../src/language";

describe("Language", () => {
    describe("ISO Language", () => {

        it("should works with _ separator", async () => {
            const obj = parseISOLang("en_US");
            expect(obj.lang).toBe("en");
            expect(obj.country).toBe("US");
        });
        it("should works with - separator", async () => {
            const obj = parseISOLang("en-US");
            expect(obj.lang).toBe("en");
            expect(obj.country).toBe("US");
        });
        it("should works with different style of countries", async () => {
            const single = parseISOLang("en");
            expect(single.lang).toBe("en");
            expect(single.country).not.toBeTruthy();

            const long = parseISOLang("enc-US");
            expect(long.lang).toBe("enc");
            expect(long.country).toBe("US");
        });
    });
});
