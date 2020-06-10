import {NotImplementedError} from "./Exceptions";
import {Logger} from "..";

export interface IPlugin<T> {

    using(input: T): IPlugin<T>;

    _match(): boolean;

    _run(): Promise<void>;
}

/**
 * This is a way to execute and easily isolate custom block logic
 *
 * Please :
 * - refer to the test to learn how to use this
 * - subclass creating a custom constructor if you have to inject dependencies to this class
 */
export class BasePlugin<T> implements IPlugin<T> {
    input: T;

    using(input: T) {
        this.input = input;
        return this;
    }

    async execute() {
        if (this._match()) {
            Logger.getInstance().info(`Running plugin [${this.constructor.name}], match found for input`, JSON.stringify(this.input));
            await this._run();
            Logger.getInstance().info(`Completed successfully`);
        }
    }


    // Methods to implement in the subclasses
    async _run() {
        throw new NotImplementedError("Please implement the method in the subclass");
    }


    _match() {
        throw new NotImplementedError("Please implement the method in the subclass");
        return true;
    }
}
