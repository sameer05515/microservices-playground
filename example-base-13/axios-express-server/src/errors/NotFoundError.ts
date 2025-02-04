// src/errors/NotFoundError.ts
import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError {
  constructor(message = "Resource Not Found") {
    super(message, 404);
  }
}
