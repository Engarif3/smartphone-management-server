export class PasswordChangeError extends Error {
  public statusCode: number;
  public data: null;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.data = null;
    // Exclude the stack trace from being included in the response
    Error.captureStackTrace(this, this.constructor);
    // Remove 'stack' property
    delete this.stack;
  }

  toJSON() {
    return {
      success: false,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
    };
  }
}
