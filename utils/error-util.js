const { ErrorCodes } = require("@/shared/errorCodes");

// pass the response that get from error #error.response
export const getErrorMessage = (error) => {
  console.log(error);
  logError(error.response.data.message, error.response.data.additionalData);
  if (error.response.status >= 400 && error.response.status < 500) {
    switch (error.response.data.errorCode) {
      case ErrorCodes.LogginUserDetailsIncorrect:
        return {
          message: "One or more user details incorrect.",
        };

      case ErrorCodes.ExisitingUser:
        return {
          message: "User already exsist with provided email.",
        };

      case ErrorCodes.ExistingBatchCode:
        return {
          message: "Batch code already exist.",
        };

      case ErrorCodes.IncorrectCSVFormat:
        return {
          message: "Incorrect CSV format.",
        };

      default:
        return {
          message: error.response.data.message,
        };
    }
  } else {
    console.error(error.response.data.message || error.response.message);
  }
};

const logError = (message, additionaDetails = null) => {
  console.error(`Message: ${message} \n + ${additionaDetails} `);
};
