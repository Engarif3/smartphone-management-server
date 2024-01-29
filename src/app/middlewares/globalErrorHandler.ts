/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import handleValidationError from '../errors/handleValidationError';
import handleZodError from '../errors/handleZodError';
import AppError from '../errors/AppError';
import { PasswordChangeError } from '../errors/PasswordChangeError';
import { UnauthorizedAccessError } from '../errors/unauthorizedAccessError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  //setting default values
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorSources = {};
  let errorMessage;

  if (err instanceof PasswordChangeError) {
    const errorResponse = err.toJSON();
    return res.status(errorResponse.statusCode).json(errorResponse);
  }

  if (err instanceof UnauthorizedAccessError) {
    const errorResponse = err.toJSON();
    return res.json(errorResponse);
  }

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    message = 'Validation Error';
    errorMessage = simplifiedError;
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err);

    // statusCode = simplifiedError?.statusCode;
    errorMessage = simplifiedError;
    message = 'Validation Error';
    // errorSources = simplifiedError?.errorSources;
    // const errorMessage = simplifiedError?.errorMessage;
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    errorMessage = simplifiedError;
    message = 'Invalid ID';
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    message = 'Already exists';
    errorMessage = simplifiedError;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  //ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    errorDetails: err,
    // err,
    // stack: config.NODE_ENV === 'development' ? err?.stack : null,
    stack: err?.stack,
  });
};

export default globalErrorHandler;
