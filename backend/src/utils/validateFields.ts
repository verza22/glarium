import { Request } from "express";

interface FieldDefinition {
    name: string;
    type: "string" | "number" | "boolean";
    required?: boolean;
}

/**
 * Validates that the request body contains the expected fields with correct types.
 *
 * @param req - Express request object
 * @param fields - List of fields to validate (name, type, required)
 * @returns string | null - Error message if invalid, otherwise null
 */
export function validateFields(req: Request, fields: FieldDefinition[]) {
    let error = "";
    if (!req.body || Object.keys(req.body).length === 0) {
        error = "Request body is required";
    }

    for (const field of fields) {
        const value = req.body[field.name];

        // Check if required field is missing
        if (field.required && (value === undefined || value === null)) {
            error = `Field '${field.name}' is required`;
        }

        // Check for type mismatch
        if (value !== undefined && typeof value !== field.type) {
            error = `Field '${field.name}' must be of type '${field.type}'`;
        }

        // Check for empty string
        if (field.type === "string" && typeof value === "string" && value.trim() === "") {
            error = `Field '${field.name}' cannot be empty`;
        }
    }

    if (error) {
        throw new Error(error);
    }

    return req.body;
}