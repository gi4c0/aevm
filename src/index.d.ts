import Joi = require('joi')
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'

type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void

export function validate (schema: Joi.ObjectSchema): ExpressMiddleware

export function validateWithResponse (schema: Joi.ObjectSchema): ExpressMiddleware

export function defaultErrorHandler (req: Request, res: Response, next: NextFunction, err): void
