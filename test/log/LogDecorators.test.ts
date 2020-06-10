import {Log, LogMetric, LogMetricSync} from "../../src";


describe("Utilities", () => {
    describe("decorators", () => {
        describe("@log decorator", () => {
            it("should return a non-null object", async () => {
                expect(Log()).toBeTruthy();
            });

            it("should not modify the return value of the original function wo arguments", async () => {
                class TestClass1 {
                    @Log()
                    method(): number {
                        return 1;
                    }
                }

                expect(new TestClass1().method()).toEqual(1);
            });

            it("should not modify the return value of the original function when passing arguments", async () => {
                class TestClass1 {
                    @Log("pre message", "before message")
                    method(): number {
                        return 1;
                    }
                }

                expect(new TestClass1().method()).toEqual(1);
            });
        });

        describe("@LogMetric decorator", () => {
            it("should return a non-null object", async () => {
                expect(Log()).toBeTruthy();
            });

            it("should not modify the return value of the original function", async () => {
                class TestClass1 {
                    @LogMetric()
                    async method() {
                        return 1;
                    }
                }

                expect(await new TestClass1().method()).toEqual(1);
            });

            it("should not modify the return value of the original function", async () => {
                class TestClass1 {
                    @LogMetric("get-test")
                    async method() {
                        return 1;
                    }
                }

                expect(await new TestClass1().method()).toEqual(1);
            });

            it("should not modify the return value of the original function when passing arguments", async () => {
                class TestClass1 {
                    @LogMetric("get-test")
                    async method(a: number, b: number) {
                        return a + b;
                    }
                }

                expect(await new TestClass1().method(1, 2)).toEqual(3);
            });

            it("should not modify the return value of the original function with await", async () => {
                class TestClass1 {
                    @LogMetric("get-test")
                    method() {
                        return new Promise(resolve =>
                            setTimeout(() => {
                                resolve(1);
                            }, 1500)
                        );
                    }
                }

                expect(await new TestClass1().method()).toEqual(1);
            });
        });

        describe("@LogMetric decorator", () => {
            it("should return a non-null object", async () => {
                expect(LogMetricSync()).toBeTruthy();
            });

            it("should not modify the return value of the original function", async () => {
                class TestClass1 {
                    @LogMetricSync()
                    method() {
                        return 1;
                    }
                }

                expect(new TestClass1().method()).toEqual(1);
            });

            it("should not modify the return value of the original function", async () => {
                class TestClass1 {
                    @LogMetricSync("get-test")
                    method() {
                        return 1;
                    }
                }

                expect(new TestClass1().method()).toEqual(1);
            });

            it("should not modify the return value of the original function when passing arguments", async () => {
                class TestClass1 {
                    @LogMetricSync("get-test")
                    method(a: number, b: number) {
                        return a + b;
                    }
                }

                expect(new TestClass1().method(1, 2)).toEqual(3);
            });
        });
    });
});
