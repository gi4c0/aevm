"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const lodash_1 = require("lodash");
const getErrorMessage = (req, schema) => {
    const result = Joi.validate(req, schema);
    let message = '';
    if (result.error) {
        message = result.error.details.map(d => d.message).join('. ');
    }
    return { message, value: result.value };
};
exports.validateWithResponse = (schema) => {
    return (req, res, next) => {
        const { message, value } = getErrorMessage(req, schema);
        if (message) {
            return res.status(400).json({ message });
        }
        lodash_1.merge(req, value);
        next();
    };
};
exports.validate = (schema) => {
    return (req, res, next) => {
        const { message, value } = getErrorMessage(req, schema);
        if (message) {
            return next({ httpCode: 400, message });
        }
        lodash_1.merge(req, value);
        next();
    };
};
exports.defaultErrorHandler = (req, res, next, err) => {
    if (process.env.NODE_ENV !== 'production')
        console.log(err);
    res.status(err.httpCode || 500).json({ message: err.message });
};
//# sourceMappingURL=index.js.map