export type JsonValue = string | number | boolean | null;

export type JsonArray = unknown[];

export type JsonObject = Record<string, unknown>;

export type JsonData = JsonValue | JsonArray | JsonObject;
