const Joi = require('joi')

/*
 * Extract error message from joi output
 * @param {object} req - The express request object
 * @param {object} schema - Joi schema object
 * @returns {string} Error message
 */
const getErrorMessage = (req, schema) => {
  const result = Joi.validate(req, schema)
  let message = ''
  if (result.error) {
    message = result.error.details.map(d => d.message).join('. ')
  }

  return message
}

/*
 * Take schema and returns express middleware which response with error
 * @param {object} schema - Joi schema
 * @returns {(req, res, next) =>}
 */
exports.validateWithResponse = schema => (req, res, next) => {
  const message = getErrorMessage(req, schema)
  if (message) {
    return res.status(400).json({ message })
  }

  next()
}

/*
 * Take schema and returns express middleware which pass error to next()
 * @param {object} schema - Joi schema
 * @returns {(req, res, next) =>}
 */
exports.validate = schema => (req, res, next) => {
  const message = getErrorMessage(req, schema)
  if (message) {
    return next({ httpCode: 400, message })
  }

  next()
}

/*
 * Error handler middleware for default responses from joi errors
 */
exports.defaultErrorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') console.log(err)
  res.status(err.httpCode || 500).json({ message: err.message })
}
