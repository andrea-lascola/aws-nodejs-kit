import {ILogger} from "../log";
import {S3} from "aws-sdk";
import * as fs from "fs";

export interface IFileSystemService {
    getFile(location: string, path: any, writeToDirectory: string): Promise<void>;
}

export class S3FileSystemService implements IFileSystemService {

    private client: S3;

    constructor(private logger: ILogger) {
        this.client = new S3();
    }

    async getFile(location: string, path: any, writeToDirectory: string = "/tmp/filename.data"): Promise<void> {
        const {Body} = await this.client.getObject({
            Bucket: location,
            Key: path
        }).promise();

        await fs.promises.writeFile(writeToDirectory, Body);
    }
}
