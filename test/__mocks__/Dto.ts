import {DTO} from "../../src";

export class Dto extends DTO {
    private constructor(public name: string) {
        super();
    }

    static fromEvent(event: any) {
        return new Dto(event.name);
    }
}
