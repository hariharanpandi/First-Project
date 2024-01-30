type DynamicField = string | number | boolean | Record<string, string | number | boolean | [string]> | [string];
type DynamicFields = Record<string, DynamicField>;

export { DynamicField, DynamicFields };