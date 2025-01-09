export class HttpException extends Error {
    errorCode: number
    constructor(message: string, errorCode: number) {
        super(message);
        this.errorCode = errorCode;
    }
}

export class BadRequestError extends HttpException {
    constructor(message: string) {
        super(message, 400);
    }
}

export class InternalServerError extends HttpException {
    constructor(message: string) {
        super(message, 500);
    }
}

export class UnAuthorizedError extends HttpException {
    constructor() {
        super('Unauthorized Request', 401);
    }
}