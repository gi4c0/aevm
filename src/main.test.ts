import Joi = require('@hapi/joi')
import { expect } from 'chai'

import * as lib from './index'

describe('Main test', () => {
  const schema = {
    body: Joi.object().keys({
      key: Joi.number().required()
    }).required()
  }

  const requestObj = {
    body: { key: 'value' },
    params: { key: 'value' },
    query: { key: 'value' }
  }

  it('Should return an error message on wrong values', () => {
    const { message } = lib.getErrorMessage(requestObj as any, schema)
    expect(message).to.be.equal("'body.key' must be a number")
  })

  it('Should return empty string on valid value', () => {
    const { message } = lib.getErrorMessage({ body: { key: 123 } } as any, schema)
    expect(message).to.be.equal('')
  })
})
