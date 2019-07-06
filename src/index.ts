import Joi = require('joi')
import { Request, Response, NextFunction } from 'express'

/*
 * Extract error message from joi output
 */
export const getErrorMessage = (req: Request, schema: IUserSchema) => {
  const valuesToValidate = {
    body: req.body,
    query: req.query,
    params: req.params,
    headers: req.headers
  }

  const result = Joi.validate(
    valuesToValidate,
    Joi.object().keys(schema as any).unknown()
  )

  let errorMessage = ''

  if (result.error) {
    errorMessage = result.error.details
      ? result.error.details.map(d => d.message).join('. ')
      : result.error.message
  }

  // Replace "" with '' for to avoid `\` chars in JSON output
  return { message: errorMessage.replace(/"/g, "'"), value: result.value }
}

/*
 * Take schema and returns express middleware which pass error to next()
 */
export const validate = (schema: IUserSchema) => {
  return (req: Request, _: Response, next: NextFunction) => {
    const { message, value } = getErrorMessage(req, schema)
    if (message) return next({ httpCode: 400, userMessage: message })

    // Pass default values specified in Joi schema to request object
    Object.assign(req, value)
    next()
  }
}

export interface IUserSchema {
  body?: Joi.ObjectSchema
  query?: Joi.ObjectSchema
  params?: Joi.ObjectSchema
  headers?: Joi.ObjectSchema
}

/*
 * Take schema and returns express middleware which response with error
 */
export const validateWithResponse = (schema: IUserSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { message, value } = getErrorMessage(req, schema)
    if (message) {
      return res.status(400).json({ message })
    }

    Object.assign(req, value)
    next()
  }
}

/*
 * Error handler middleware for default responses from joi errors
 */
export const defaultErrorHandler = (err, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'production') console.log(err)
  res.status(err.httpCode || 500).json({ message: err.userMessage || err.message })
}
