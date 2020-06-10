import {
    randomFromArray,
    base64encode,
    base64decode,
    base64decodeObject,
    base64encodeObject
} from "../../src/core";


describe("Transform", () => {
    describe("base 64", () => {
        it("base 64 encode", async () => {
            expect(base64encode("random")).toBe("cmFuZG9t");
        });

        it("base 64 decode", async () => {
            expect(base64decode("cmFuZG9t")).toBe("random");
        });

        it("base 64 object encode", async () => {
            expect(base64encodeObject({"pk": "0", "sk": "0"})).toBe("eyJwayI6IjAiLCJzayI6IjAifQ==");
        });
        it("base 64 object decode", async () => {
            expect(base64decodeObject("eyJwayI6IjAiLCJzayI6IjAifQ==")).toStrictEqual({"pk": "0", "sk": "0"});
        });
    });


    describe("Random", () => {
        it("random from array", async () => {
            const data = [1, 2, 3];

            const item = randomFromArray(data);
            expect(data.indexOf(item)).not.toBe(-1);

        });
    });
});
