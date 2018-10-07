const Joi = require('joi')

const getErrorMessage = (req, schema) => {
  const result = Joi.validate(req, schema)
  let message = ''
  if (result.error) {
    message = result.error.details.map(d => d.message).join('. ')
  }

  return message
}

exports.validateWithResponse = schema => (req, res, next) => {
  const message = getErrorMessage(req, schema)
  if (message) {
    return res.status(400).json({ message })
  }

  next()
}

exports.validate = schema => (req, res, next) => {
  const message = getErrorMessage(req, schema)
  if (message) {
    return next({ httpCode: 400, message })
  }

  next()
}

exports.joiErrorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') console.log(err)
  res.status(err.httpCode || 500).json({ message: err.message })
}
