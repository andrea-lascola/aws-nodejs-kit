import {Optional} from "../src/core";

const value: number | undefined = 10;
const compute = Optional.fromValue(value)
    .map((val: number) => val + 10)
    .map((val: number) => val * 2)
    .getOrElse(10);

console.log(compute); // 40
