export class ValidationError extends Error {
    constructor(message, data = null) {
        super(message);
        this.name = "ValidationError";
        this.data = data; // Optional data field
        //   this.statusCode = StatusCodes.BAD_REQUEST; // HTTP Bad Request
    }
}