import Joi = require('joi')
import { merge } from 'lodash'
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'

// TODO: something
/*
 * Extract error message from joi output
 * @param {object} req - The express request object
 * @param {object} schema - Joi schema object
 * @returns {string} Error message
 */
const getErrorMessage = (req: Request, schema: Joi.ObjectSchema) => {
  const result = Joi.validate(req, schema)
  let message = ''
  if (result.error) {
    message = result.error.details
      ? result.error.details.map(d => d.message).join('. ')
      : result.error.message
  }

  return { message: message.replace(/"/g, "'"), value: result.value }
}

/*
 * Take schema and returns express middleware which response with error
 * @param {object} schema - Joi schema
 * @returns {(req, res, next) =>}
 */
export const validateWithResponse = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { message, value } = getErrorMessage(req, schema)
    if (message) {
      return res.status(400).json({ message })
    }

    merge(req, value)
    next()
  }
}

/*
 * Take schema and returns express middleware which pass error to next()
 * @param {object} schema - Joi schema
 * @returns {(req, res, next) =>}
 */
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { message, value } = getErrorMessage(req, schema)
    if (message) {
      return next({ httpCode: 400, message })
    }

    merge(req, value)
    next()
  }
}

/*
 * Error handler middleware for default responses from joi errors
 */
export const defaultErrorHandler = (err, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'production') console.log(err)
  res.status(err.httpCode || 500).json({ message: err.message })
}
