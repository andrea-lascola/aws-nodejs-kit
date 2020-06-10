import {SQS} from "aws-sdk";
import {ILogger} from "../log";

export interface IQueueService {
    sendMessage(data: any): Promise<void>;
}

export class QueueService implements IQueueService {

    private queue: SQS;

    constructor(private logger: ILogger,
                private queueUrl: string,
                queue?: SQS) {
        this.queue = queue || new SQS({
            endpoint: queueUrl
        });
    }

    /**
     * Push data to queue
     * @param data: any data that can be an input of JSON.stringify
     */
    async sendMessage(data: any): Promise<void> {
        const payload = {
            QueueUrl: this.queueUrl,
            MessageBody: JSON.stringify(data)
        };

        await this.queue.sendMessage(payload).promise();
    }
}
