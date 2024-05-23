export class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}



export class NetworkError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NetworkError';
    }
}

export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

// Example usage:
const runExampleUsage=()=>{
    try {
        // Some code that might throw different types of errors
        throw new NetworkError('Failed to connect to the network.');
        // throw new ValidationError('Invalid input data.');
    } catch (error) {
        if (error instanceof NetworkError) {
            console.error('Network Error: ', error.message);
        } else if (error instanceof ValidationError) {
            console.error('Validation Error: ', error.message);
        } else {
            console.error('Generic Error: ', error.message);
        }
    }
    
    
    // Example usage:
    try {
        throw new CustomError('This is a custom error!');
    } catch (e) {
        console.error(e.name);    // CustomError
        console.error(e.message); // This is a custom error!
        console.error(e.stack);   // Stack trace
    }
}

// runExampleUsage();