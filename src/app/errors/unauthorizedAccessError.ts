export class UnauthorizedAccessError extends Error {
  public errorMessage: string;

  constructor(message: string, errorMessage: string) {
    super(message);
    this.name = this.constructor.name;
    this.errorMessage = errorMessage;

    // Exclude the stack trace from being included in the response
    // Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: false,
      message: this.message,
      errorMessage: this.errorMessage,
      errorDetails: null,
      stack: null,
    };
  }
}
