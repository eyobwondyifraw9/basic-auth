class ServerError extends Error {
    constructor(statusCode, message, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = "Server Error"
    }

    static badRequest(message, details = null) {
        return new ServerError(400, message, details);
    }

    static unauthorized(message, details = null) {
        return new ServerError(401, message, details);
    }

    static forbidden(message, details = null) {
        return new ServerError(403, message, details);
    }

    static notFound(message, details = null) {
        return new ServerError(404, message, details);
    }

    static internal(message, details = null) {
        return new ServerError(500, message, details);
    }
}

module.exports = ServerError;