import * as jwt from "jsonwebtoken";


interface IClaim {
    data: any;
    aud?: string | string[];
    iss?: string;
    sub?: string;
}

/**
 * Create a jwt token with a std claim object:
 *
 * {
 *     data : payload, // custom metadata needed by the application
 *     iss : options.iss // optional issuer of the jwt
 *     aud : options.aud // optional audience
 * }
 *
 * ref: https://jwt.io
 *
 * @param payload
 * @param secretOrPrivateKey
 * @param expirationSeconds
 * @param options
 */
export const jwtCreate = (payload: any,
                          secretOrPrivateKey: string,
                          expirationSeconds: number,
                          options: {
                              aud?: string[],
                              iss?: string
                          } = {}): string => {

    const claim: IClaim = {
        ...{
            data: payload
        }, ...options
    };

    return jwt.sign(
        claim,
        secretOrPrivateKey,
        {
            expiresIn: expirationSeconds
        });
};

/**
 * Decode and verify a Jwt token
 *
 * verify against:
 * - token expiration
 * - audience
 * - issuer
 *
 * return decoded token
 *
 * @param token: jwt string example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ1bml2ZXJzZSIsImF1ZCI6InN0b3J5X25ldyIsImRhdGEiOnsiaW1hZ2VVcmwiOiJ0ZXN0In19.Igp3yaTI_4HL9WIRCTAxKBIRpDkzNMLZ9vbiQjGB4Zs
 * @param secretOrPrivateKey
 * @param validationOptions
 */
export const jwtDecode = <T extends IClaim>(token: string,
                                            secretOrPrivateKey: string,
                                            validationOptions: {
                                                audience?: string,
                                                issuer?: string
                                            } = {}): T => {

    return (jwt.verify(token, secretOrPrivateKey, validationOptions) as T);
};
