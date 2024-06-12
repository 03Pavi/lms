/* eslint-disable snakecasejs/snakecasejs */
const { Sequelize } = require('sequelize');
const { http_status_code } = require("../lib/constants");

/**
 * Handles errors and sends an appropriate HTTP response.
 * @param {object} res - The Express response object.
 * @param {Error} err - The error object.
 */
function handle_error(res, err) {
  // Log the error for debugging purposes
  // console.error('\nError:', err.name);

  // Default values for error handling
  let error_message = "Internal Server Error";
  let status_code = http_status_code.INTERNAL_SERVER;

  // Extracts the validation message from a Sequelize unique error
  if (err instanceof Sequelize.UniqueConstraintError) {
    return res.status(http_status_code.CONFLICT).json({ error: `${err.fields[0] || Object.values(err.fields)[0]} already exists.`});
  }
  
  // Extracts the validation message from a Sequelize validation error
  if (err instanceof Sequelize.ValidationError) {
    return res.status(http_status_code.BAD_REQUEST).json({ error: "Invalid payload." });
  }
  

  // Extracts the validation message from a Sequelize during bulk insert
  if (err.name === 'AggregateError') {
    const errors = err.errors.map((err) => ({
      field: err.path,
      message: err.message,
    }));
    return res.status(http_status_code.BAD_REQUEST).json({ error: "Invalid payload.", errors });
  }

  if(err.name === 'ZodError') {
    let issues = {}
    err.issues.forEach((issue) => issues[issue.path] = issue.message)
    return res.status(http_status_code.BAD_REQUEST).json({ errors: issues });
  }

  if(err.message === 'WHERE parameter "uuid" has invalid "undefined" value') {
    return res.status(http_status_code.BAD_REQUEST).json({ error: "UUID is required." });
  }

  if (err.name === 'SequelizeDatabaseError' && err.parent?.code === '22P02') { 
    return res.status(http_status_code.BAD_REQUEST).json({ error: "Provided uuid is invalid." });
  }

  // Extracts the validation message from error name
  if (err.name === "NOT_FOUND") {
    return res.status(http_status_code.NOT_FOUND).json({ error: err.message });
  }

  // Extracts the validation message from error name
  if (err.name === "BAD_REQUEST") {
    return res.status(http_status_code.BAD_REQUEST).json({ error: err.message });
  }

  // Extracts the validation message from error name
  if (err.name === "CONFLICT") {
    return res.status(http_status_code.CONFLICT).json({ error: err.message });
  }

  // Extracts the validation message from a Sequelize validation error
  const error_message_parts = err?.message?.split(':') || [];
  if (error_message_parts?.length) {
    if (err.name === 'SequelizeValidationError' || error_message_parts[0] === 'SequelizeValidationError') {
      status_code = http_status_code.BAD_REQUEST;
      error_message = error_message_parts[error_message_parts.length - 1].trim() || "Invalid payload";
    } else if (err.name === "SequelizeUniqueConstraintError" || error_message_parts[0] === 'SequelizeUniqueConstraintError') {
      status_code = http_status_code.CONFLICT;
      error_message = error_message_parts[error_message_parts.length - 1].trim() || "Same resource already exists";
    }
  }

  // Customize error handling based on the type of error
  if (err instanceof custom_error) {
    error_message = err.message;
    status_code = err.status_code;
  }

  // Send the appropriate response to the client
  res.status(status_code).json({
    error: error_message,
  });
}

/**
 * Custom error class for handling specific error cases.
 */
class custom_error extends Error {
  constructor(message, status_code) {
    super(message);
    this.status_code = status_code;
  }
}

module.exports = {
  handle_error,
  custom_error,
};
