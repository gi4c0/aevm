"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("@hapi/joi");
exports.getErrorMessage = (req, schema) => {
    const valuesToValidate = {
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers
    };
    const result = Joi.object().keys(schema).unknown().validate(valuesToValidate);
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
exports.paramId = (paramName) => {
    const schema = {
        params: Joi.object().keys({
            [paramName]: Joi.number().required()
        }).required().unknown()
    };
    return exports.validate(schema);
};
exports.queryId = (queryParamName) => {
    const schema = {
        query: Joi.object().keys({
            [queryParamName]: Joi.number().required()
        }).required().unknown()
    };
    return exports.validate(schema);
};
exports.queryString = (queryParamName) => {
    const schema = {
        query: Joi.object().keys({
            [queryParamName]: Joi.string().required()
        }).required().unknown()
    };
    return exports.validate(schema);
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
exports.defaultErrorHandler = (err, req, res, _) => {
    if (process.env.NODE_ENV !== 'production')
        console.log(err);
    res.status(err.httpCode || 500).json({ message: err.userMessage || err.message });
};
