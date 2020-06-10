import {URL} from "url";
import {jwtCreate} from "../";

/**
 *
 * @param endpoint
 * @param data
 * @param secret
 * @param props
 */
export const getWebhookUrl = <T>(endpoint: string, data: T, secret: string, props: { audience?: string[], issuer?: string, expInSeconds: number }): string => {
    const url = new URL(endpoint);
    url.searchParams.set("token", jwtCreate(
        data,
        secret,
        props.expInSeconds, {
            aud: props.audience,
            iss: props.issuer
        }));
    return url.href;
};
