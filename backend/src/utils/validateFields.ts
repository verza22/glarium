import { Request } from "express";

interface FieldDefinition {
  name: string;
  type: "string" | "number" | "boolean" | "number[]";
  required?: boolean;
}

/**
 * Validates that the request body contains the expected fields with correct types.
 *
 * @param req - Express request object
 * @param fields - List of fields to validate (name, type, required)
 * @returns - The validated body or throws an error
 */
export function validateFields(req: Request, fields: FieldDefinition[]) {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new Error("Request body is required");
  }

  for (const field of fields) {
    const value = req.body[field.name];

    // Required field check
    if (field.required && (value === undefined || value === null)) {
      throw new Error(`Field '${field.name}' is required`);
    }

    // Skip undefined optional fields
    if (value === undefined || value === null) continue;

    switch (field.type) {
      case "string":
        if (typeof value !== "string") {
          throw new Error(`Field '${field.name}' must be of type string`);
        }
        if (value.trim() === "") {
          throw new Error(`Field '${field.name}' cannot be empty`);
        }
        break;

      case "number":
        if (typeof value !== "number" || isNaN(value)) {
          throw new Error(`Field '${field.name}' must be a valid number`);
        }
        break;

      case "boolean":
        if (typeof value !== "boolean") {
          throw new Error(`Field '${field.name}' must be of type boolean`);
        }
        break;

      case "number[]":
        if (!Array.isArray(value)) {
          throw new Error(`Field '${field.name}' must be an array of numbers`);
        }
        if (value.length === 0) {
          throw new Error(`Field '${field.name}' cannot be an empty array`);
        }
        for (const item of value) {
          if (typeof item !== "number" || isNaN(item)) {
            throw new Error(
              `Field '${field.name}' must contain only valid numbers`
            );
          }
        }
        break;

      default:
        throw new Error(`Unsupported field type '${field.type}'`);
    }
  }

  return req.body;
}