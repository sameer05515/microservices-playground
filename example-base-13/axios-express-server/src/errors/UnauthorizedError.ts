// src/errors/UnauthorizedError.ts
import { BaseError } from "./BaseError";

export class UnauthorizedError extends BaseError {
  constructor(message = "Unauthorized Access") {
    super(message, 401);
  }
}
