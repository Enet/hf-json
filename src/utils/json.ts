import {JsonData, JsonValue} from 'types/json';

export const isJsonData = (jsonData?: unknown): jsonData is JsonData => {
    return jsonData !== undefined && typeof jsonData !== 'function';
};

export const isJsonValue = (jsonData?: JsonData): jsonData is JsonValue => {
    return isJsonData(jsonData) && (jsonData === null || typeof jsonData !== 'object');
};
