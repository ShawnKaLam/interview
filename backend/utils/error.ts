export class ApplicationError extends Error {
	constructor(message: string, public httpStatus: number) {
		super(message); // new Error(message)
		Object.setPrototypeOf(this, ApplicationError.prototype);
	}
}

export class InternalServerError extends ApplicationError {
	constructor() {
		super("internal server error", 500);
		Object.setPrototypeOf(this, ApplicationError.prototype);
	}
}

export class InvalidInfoError extends ApplicationError {
	constructor() {
		super("invalid username or password", 400);
		Object.setPrototypeOf(this, ApplicationError.prototype);
	}
}

export class UnauthorizedError extends ApplicationError {
	constructor() {
		super("Unauthorized", 401);
		Object.setPrototypeOf(this, ApplicationError.prototype);
	}
}

export class DuplicatedRegisterError extends ApplicationError {
	constructor() {
		super("Already registered", 401);
		Object.setPrototypeOf(this, ApplicationError.prototype);
	}
}
