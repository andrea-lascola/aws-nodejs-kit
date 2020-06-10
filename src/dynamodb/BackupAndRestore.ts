/* istanbul ignore file */
import {scanAllDynamodbItems} from "./Pagination";
import {Logger} from "../log";
import {DocumentClient} from "aws-sdk/clients/dynamodb";

const fs = require("fs");
const os = require("os");
const readline = require("readline");

export const getFilename = (tableName: string, filename?: string) => {
    return filename ? filename : `${tableName}.bkp`;
};

/**
 * Save all dynamotable row to a file for future restore
 * @param db
 * @param tableName
 * @param filename
 */
export const backup = async (db: DocumentClient, tableName: string, filename?: string) => {
    const fName = getFilename(tableName, filename);

    const stream = fs.createWriteStream(fName, {flags: "a"});

    fs.truncate(fName, () => console.log("Cleaned file"));

    await scanAllDynamodbItems(Logger.getInstance(),
        db,
        tableName,
        async (items: any[]) => {
            for (const item of items) {
                await stream.write(`${JSON.stringify(item)}${os.EOL}`, () => console.log(`Writed: ${item.pk}`));
            }
        });
    stream.end();
};


/**
 * Restore data to tableName from an input file (containing a json element per-row)
 * @param db
 * @param tableName
 * @param filename
 */
export const restore = async (db: DocumentClient, tableName: string, filename?: string) => {
    const fName = getFilename(tableName, filename);

    const stream = fs.createReadStream(fName);
    const readInterface = readline.createInterface({
        input: stream
    });

    readInterface.on("line", async (line: any) => {
        const item = JSON.parse(line);
        console.log(`Put new element: params [${JSON.stringify(item)}]`);

        const params = {
            TableName: tableName,
            Item: item
        };

        try {
            await db.put(params).promise();
        } catch (e) {
            console.error(e);
            process.exit();
        }
    });

    readInterface.on("close", (line: any) => {
        console.log("End of the file");
    });
};


/**
 * truncate table: Scan all items in the table and delete them
 * @param db
 * @param tableName
 */
export const truncate = async (db: DocumentClient, tableName: string) => {
    await scanAllDynamodbItems(Logger.getInstance(),
        db,
        tableName,
        async (items: any[]) => {
            for (const item of items) {
                await db.delete({
                    TableName: tableName,
                    Key: {
                        pk: item.pk
                    },
                }).promise();
            }
        });
};

