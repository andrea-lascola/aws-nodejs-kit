import * as crypto from "crypto";

export const encrypt = (text: string, key: string, algorithm: string = "aes-256-cbc") => {
    let cipher = crypto.createCipher(algorithm, key);
    let crypted = cipher.update(text, "utf8", "hex");
    crypted += cipher.final("hex");
    return crypted;
};
