declare module "aws-xray-sdk" {
    export function captureAWS<T>(client: T): T;
}
