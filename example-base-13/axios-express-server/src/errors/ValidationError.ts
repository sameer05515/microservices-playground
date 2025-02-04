// src/errors/ValidationError.ts
import { BaseError } from "./BaseError";

export class ValidationError extends BaseError {
  constructor(message = "Invalid Request Data") {
    super(message, 400);
  }
}
