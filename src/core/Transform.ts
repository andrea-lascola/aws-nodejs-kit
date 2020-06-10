export const randomFromArray = <T>(array: T[]) => array[Math.floor(Math.random() * array.length)];

export const randint = <T>(max: number) => Math.floor(Math.random() * max);

// Base 64
export const base64encode = (data: string): string => {
    return Buffer.from(data).toString("base64");
};

export const base64decode = (data: string): string => {
    let buff = new Buffer(data, "base64");
    return buff.toString("ascii");
};


export const base64encodeObject = <T>(data: T): string => {
    return base64encode(JSON.stringify(data));
};

export const base64decodeObject = <T>(data: string): T => {
    return JSON.parse(base64decode(data));
};
