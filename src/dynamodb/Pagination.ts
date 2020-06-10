import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {base64decodeObject, base64encodeObject} from "../core";
import {Logger} from "../log";

export type Cursor = string | undefined;

export interface IMultiCursor {
    excluded: { [name: string]: any };
    cursor: { [name: string]: Cursor };
}

const PaginationLimit = 250;

/**
 * Perform a paginated Query on DynamoDb
 * @param logger
 * @param db
 * @param params
 * @param fieldsInCursor
 * @param itemsPerPage
 * @param itemsPerFetch
 * @param cursor
 */
export const paginatedQuery = async <T>(logger: Logger,
                                        db: DocumentClient,
                                        params: DocumentClient.QueryInput,
                                        fieldsInCursor: string[],
                                        itemsPerPage: number,
                                        itemsPerFetch: number,
                                        cursor?: Cursor
): Promise<{ items: T[], cursor: Cursor }> => {

    params.Limit = itemsPerFetch;
    itemsPerPage = itemsPerPage < PaginationLimit ? itemsPerPage : PaginationLimit;

    if (cursor) {
        params.ExclusiveStartKey = base64decodeObject(cursor);
    }

    const fetch = async (parameters: DocumentClient.QueryInput,
                         remainingCount: number,
                         elements: T[] = []): Promise<{ items: T[], cursor: string | undefined }> => {

        logger.info("Fetching with params", JSON.stringify(parameters), remainingCount);
        logger.info("Starting with Count", remainingCount);
        const {Items, LastEvaluatedKey, Count} = await db.query(parameters).promise();
        logger.info(`Got Query result:  Items: ${Items ? Items.length : 0} - Count: ${Count} - LastEvaluatedKey: ${LastEvaluatedKey}`);

        const remainingCountAfterFetch = typeof Count !== "undefined" ? remainingCount - Count : 0;

        if (Items) {
            // Add Items to Elements
            elements = elements.concat(
                (remainingCountAfterFetch < 0 ? Items.slice(0, remainingCount) : Items) as T[]);
        }

        if (remainingCountAfterFetch <= 0 || typeof LastEvaluatedKey === "undefined") {

            let cursor;

            if (remainingCountAfterFetch < 0) {
                // Get last element in array
                const lastItem = elements.slice(-1)[0];
                cursor = getCursorFromItem(lastItem, fieldsInCursor);
            } else if (typeof LastEvaluatedKey === "undefined") {
                cursor = undefined;
            } else {
                cursor = base64encodeObject(LastEvaluatedKey);
            }
            return {
                items: elements,
                cursor: cursor
            };
        }

        return await fetch({
            ...parameters,
            ...{
                ExclusiveStartKey: LastEvaluatedKey
            }
        }, remainingCountAfterFetch, elements);
    };

    return await fetch(params, itemsPerPage);
};


/**
 * Calc cursor object and get base64 encode
 *
 * @param element
 * @param fields
 */
export const getCursorFromItem = (element: DocumentClient.AttributeMap, fields: string[]): string => {
    return base64encodeObject(
        calcCursorFromItem(element, fields)
    );
};

/**
 * Calc cursor object : {"pk": ..., "sk" : .....}
 * @param element
 * @param fields
 */
const calcCursorFromItem = (element: DocumentClient.AttributeMap, fields: string[]): DocumentClient.Key => {
    return fields.reduce((acc: any, el: string) => {
        acc[el] = element[el];
        return acc;
    }, {});
};

/**
 * Scan all dynamo db items in table
 * @warning: this can lead to raise the global costs
 *
 * @param logger
 * @param db
 * @param tableName
 * @param callback optional call at every iteration
 * @param indexName optional use an index
 * @param overrideDynamoParameters: override the
 */
export const scanAllDynamodbItems = async <T>(logger: Logger,
                                              db: DocumentClient,
                                              tableName: string,
                                              callback?: (items: T[]) => Promise<void>,
                                              indexName?: string,
                                              overrideDynamoParameters?: DocumentClient.ScanInput): Promise<T[]> => {


    let params: DocumentClient.ScanInput = {
        TableName: tableName
    };
    if (indexName) {
        params.IndexName = indexName;
    }
    params = {...params, ...overrideDynamoParameters};

    let scanResults: T[] = [];
    let evaluatedkey;
    do {
        const {Items, LastEvaluatedKey} = await db.scan(params).promise();

        evaluatedkey = LastEvaluatedKey;

        if (Items) {
            if (callback) {
                await callback(Items as T[]);
            } else {
                Items.forEach((item) => scanResults.push(item as T));
            }
        }
        params.ExclusiveStartKey = LastEvaluatedKey;
    } while (typeof evaluatedkey !== "undefined");

    return scanResults;
};
