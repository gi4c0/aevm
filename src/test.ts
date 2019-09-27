import Joi = require('@hapi/joi')

import { getErrorMessage } from './index'

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
}

const requestObj = {
  body: { key: 'value' },
  params: { key: 'value' },
  query: { key: 'value' }
}

const wrongObj = {
  body: { key: 'values' },
  params: { key: 'value' },
  query: { key: 'value' }
}

const { message, value } = getErrorMessage(requestObj as any, schema)
console.log(message)
console.log(value)

const err = getErrorMessage(wrongObj as any, schema)
console.log(err.message)
console.log(err.value)
