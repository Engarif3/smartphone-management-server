import mongoose from 'mongoose';

const handleValidationError = (err: mongoose.Error.ValidationError) => {
  const errorMessage = Object.values(err.errors)
    .map((val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return `${val?.message}`;
    })
    .join('. ');

  return errorMessage;
};

export default handleValidationError;
