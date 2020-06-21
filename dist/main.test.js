"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("@hapi/joi");
const chai_1 = require("chai");
const lib = require("./index");
describe('Main test', () => {
    const schema = {
        body: Joi.object().keys({
            key: Joi.number().required()
        }).required()
    };
    const requestObj = {
        body: { key: 'value' },
        params: { key: 'value' },
        query: { key: 'value' }
    };
    it('Should return an error message on wrong values', () => {
        const { message } = lib.getErrorMessage(requestObj, schema);
        chai_1.expect(message).to.be.equal("'body.key' must be a number");
    });
    it('Should return empty string on valid value', () => {
        const { message } = lib.getErrorMessage({ body: { key: 123 } }, schema);
        chai_1.expect(message).to.be.equal('');
    });
});
