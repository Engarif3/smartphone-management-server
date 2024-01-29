/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */
// /* eslint-disable @typescript-eslint/no-explicit-any */

const handleDuplicateError = (err: any) => {
  // Check if the error has errorDetails and keyValue
  if (err && err.keyValue) {
    const dynamicPropertyValue = findDynamicPropertyValue(err.keyValue);

    if (dynamicPropertyValue !== null) {
      const errorMessage = `${dynamicPropertyValue} already exists`;
      return errorMessage;
    }
  }

  // Default error message if dynamic property is not found
  return 'Duplicate error occurred';
};

// Function to find the dynamic property value
const findDynamicPropertyValue = (obj: any) => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return obj[key];
    }
  }
  return null;
};

export default handleDuplicateError;
