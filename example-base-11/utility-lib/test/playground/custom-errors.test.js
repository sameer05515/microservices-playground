import { CustomError, NetworkError, ValidationError } from '../../src/playground/custom-errors';

describe('CustomError', () => {
    it('should set the name and message properties correctly', () => {
        const message = 'This is a custom error';
        const error = new CustomError(message);

        expect(error.name).toBe('CustomError');
        expect(error.message).toBe(message);
    });

    it('should capture the stack trace', () => {
        const message = 'This is a custom error';
        const error = new CustomError(message);

        expect(error.stack).toBeDefined();
        expect(error.stack).toContain('CustomError');
    });
});

describe('NetworkError', () => {
    it('should set the name and message properties correctly', () => {
        const message = 'Failed to connect to the network';
        const error = new NetworkError(message);

        expect(error.name).toBe('NetworkError');
        expect(error.message).toBe(message);
    });

    it('should capture the stack trace', () => {
        const message = 'Failed to connect to the network';
        const error = new NetworkError(message);

        expect(error.stack).toBeDefined();
        expect(error.stack).toContain('NetworkError');
    });
});

describe('ValidationError', () => {
    it('should set the name and message properties correctly', () => {
        const message = 'Invalid input data';
        const error = new ValidationError(message);

        expect(error.name).toBe('ValidationError');
        expect(error.message).toBe(message);
    });

    it('should capture the stack trace', () => {
        const message = 'Invalid input data';
        const error = new ValidationError(message);

        expect(error.stack).toBeDefined();
        expect(error.stack).toContain('ValidationError');
    });
});
