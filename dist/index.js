"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
exports.getErrorMessage = (req, schema) => {
    const valuesToValidate = {
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers
    };
    const result = Joi.validate(valuesToValidate, Joi.object().keys(schema).unknown());
    let errorMessage = '';
    if (result.error) {
        errorMessage = result.error.details
            ? result.error.details.map(d => d.message).join('. ')
            : result.error.message;
    }
    return { message: errorMessage.replace(/"/g, "'"), value: result.value };
};
exports.validate = (schema) => {
    return (req, _, next) => {
        const { message, value } = exports.getErrorMessage(req, schema);
        if (message)
            return next({ httpCode: 400, userMessage: message });
        Object.assign(req, value);
        next();
    };
};
exports.validateWithResponse = (schema) => {
    return (req, res, next) => {
        const { message, value } = exports.getErrorMessage(req, schema);
        if (message) {
            return res.status(400).json({ message });
        }
        Object.assign(req, value);
        next();
    };
};
exports.defaultErrorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV !== 'production')
        console.log(err);
    res.status(err.httpCode || 500).json({ message: err.userMessage || err.message });
};
