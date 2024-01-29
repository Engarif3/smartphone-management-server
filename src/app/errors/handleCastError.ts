import mongoose from 'mongoose';

const handleCastError = (err: mongoose.Error.CastError): string => {
  const errorMessage = `${err.value} is not a valid ID!`;

  return errorMessage;
};

export default handleCastError;
