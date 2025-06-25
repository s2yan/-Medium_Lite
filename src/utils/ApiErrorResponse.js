class ApiErrorResponse extends Error {
    constructor(statusCode, message, error) {
        super(message); // sets the message and populates this.stack
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.message = message;
        this.error = error;

        // Capture stack trace and exclude this constructor from it
        Error.captureStackTrace(this, this.constructor);
    }
}

export { ApiErrorResponse };
