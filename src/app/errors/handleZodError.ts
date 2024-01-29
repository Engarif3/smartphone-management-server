import { ZodError, ZodIssue } from 'zod';

const handleZodError = (err: ZodError): string => {
  const errorMessage = err.issues
    .map((issue: ZodIssue) => {
      return `${issue.message.toLowerCase()}`;
    })
    .join('. ');

  return errorMessage;
};

export default handleZodError;
