import Joi = require('joi')
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import { IUserSchema } from './index'

type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void

export function validate (schema: IUserSchema): ExpressMiddleware

export function validateWithResponse (schema: Joi.ObjectSchema): ExpressMiddleware

export function defaultErrorHandler (err, req: Request, res: Response, next: NextFunction): void
