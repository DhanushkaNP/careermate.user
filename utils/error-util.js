const { ErrorCodes } = require("@/shared/errorCodes");

// pass the response that get from error #error.response
export const getErrorMessage = (error) => {
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

      case ErrorCodes.InvalidStudentCreateData:
        return {
          message:
            "Invalid student data. Valid email and student Id should be provided.",
        };

      case ErrorCodes.ContactAlreadyExists:
        return {
          message: "Contact or link you trying to create is already exists.",
        };

      default:
        return {
          message: error.response.data.Message,
        };
    }
  } else {
    logError(error.response.data.message, error.response.data.additionalData);
  }
};

const logError = (message, additionaDetails = null) => {
  console.error(`Message: ${message} \n + ${additionaDetails} `);
};
