import Joi = require('@hapi/joi')
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

  const result = Joi.object().keys(schema as any).unknown().validate(
    valuesToValidate
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

/**
 * Create validation for a single numeric parameter id like /users/:userId
 */
export const paramId = (paramName: string) => {
  const schema = {
    params: Joi.object().keys({
      [paramName]: Joi.number().required()
    }).required().unknown()
  }

  return validate(schema)
}

/**
 * Create validation for a single query parameter id like ?queryParam=
 */
export const queryId = (queryParamName: string) => {
  const schema = {
    query: Joi.object().keys({
      [queryParamName]: Joi.number().required()
    }).required().unknown()
  }

  return validate(schema)
}

/**
 * Create validation for a single query string parameter like ?queryParam=
 */
export const queryString = (queryParamName: string) => {
  const schema = {
    query: Joi.object().keys({
      [queryParamName]: Joi.string().required()
    }).required().unknown()
  }

  return validate(schema)
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
export const defaultErrorHandler = (err, req: Request, res: Response, _) => {
  if (process.env.NODE_ENV !== 'production') console.log(err)
  res.status(err.httpCode || 500).json({ message: err.userMessage || err.message })
}
