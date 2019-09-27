"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("@hapi/joi");
const index_1 = require("./index");
const schema = {
    body: Joi.object().keys({
        key: 'something'
    }).required(),
    params: Joi.object().keys({
        key: 'value'
    }).required(),
    query: Joi.object().keys({
        key: 'value'
    }).required()
};
const requestObj = {
    body: { key: 'value' },
    params: { key: 'value' },
    query: { key: 'value' }
};
const wrongObj = {
    body: { key: 'values' },
    params: { key: 'value' },
    query: { key: 'value' }
};
const { message, value } = index_1.getErrorMessage(requestObj, schema);
console.log(message);
console.log(value);
const err = index_1.getErrorMessage(wrongObj, schema);
console.log(err.message);
console.log(err.value);
