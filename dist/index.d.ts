import Joi = require('@hapi/joi');
import { Request, Response, NextFunction } from 'express';
export declare const getErrorMessage: (req: Request, schema: IUserSchema) => {
    message: string;
    value: any;
};
export declare const validate: (schema: IUserSchema) => (req: Request, _: Response, next: NextFunction) => void;
export declare const paramId: (paramName: string) => (req: Request, _: Response, next: NextFunction) => void;
export declare const queryId: (queryParamName: string) => (req: Request, _: Response, next: NextFunction) => void;
export declare const queryString: (queryParamName: string) => (req: Request, _: Response, next: NextFunction) => void;
export interface IUserSchema {
    body?: Joi.ObjectSchema;
    query?: Joi.ObjectSchema;
    params?: Joi.ObjectSchema;
    headers?: Joi.ObjectSchema;
}
export declare const validateWithResponse: (schema: IUserSchema) => (req: Request, res: Response, next: NextFunction) => import("express-serve-static-core").Response;
export declare const defaultErrorHandler: (err: any, req: Request, res: Response, _: any) => void;
