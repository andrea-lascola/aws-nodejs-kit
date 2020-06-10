export class Optional<T> {
    private constructor(private value: T | null) {
    }

    private static some<T>(value: T) {
        if (value === null) {
            throw Error("Provided value must not be empty");
        }
        return new Optional(value);
    }

    private static none<T>() {
        return new Optional<T>(null);
    }

    static fromValue<T>(value: T | null) {
        return value === null ? Optional.none<T>() : Optional.some(value);
    }

    getOrElse(defaultValue: T | null) {
        return this.value === null ? defaultValue : this.value;
    }

    map<R>(f: (wrapped: T) => R): Optional<R> {
        if (this.value === null) {
            return Optional.none<R>();
        } else {
            return Optional.fromValue(f(this.value));
        }
    }

    mapCanThrow<R>(f: (wrapped: T) => R | null): Optional<R> {
        if (this.value !== null) {
            try {
                const value = f(this.value);
                return Optional.fromValue(value);
            } catch (e) {
            }
        }
        return Optional.none<R>();
    }
}
