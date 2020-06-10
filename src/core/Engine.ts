import {Middleware} from "./Middlewares";

export type Handler = (event: any, context?: any, callback?: any) => any;

/**
 * Common Lambda constructor facility
 */
export class Lambda {
    private readonly handler: any;
    private middlewares: Middleware[] = [];

    public constructor(handler: Handler) {
        this.handler = handler;
    }

    public with(middleware: Middleware): Lambda {
        this.middlewares.push(middleware);
        return this;
    }

    public toFn(): Handler {
        const exec = (handler: Handler) => (event: any) => {
            return this.middlewares.reduceRight((acc: any, f: any) => {
                return () => f(event, acc);
            }, (x: any, y: any) => handler(event))(null, null);
        };
        return exec(this.handler);
    }
}

/**
 * Use Common common generic interfaces
 */
export interface IUseCaseInput {

}

export interface IUseCaseOutput {

}

export interface IUseCase<T extends IUseCaseInput, R extends IUseCaseOutput> {
    execute(input: T): Promise<R>;
}
