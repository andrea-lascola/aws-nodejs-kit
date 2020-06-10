export class MockCognito {
    impl = {
        "adminGetUser": jest.fn(),
    };

    constructor() {
    }

    overrideImpl(method: "adminGetUser", impl: any) {
        this.impl[method] = impl;
    }

    adminGetUser() {
        return {
            promise: this.impl["adminGetUser"]
        };
    }
}

