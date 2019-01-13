# Joi validator middleware

## Getting started
### Simple usecase
```js
const Joi = require('joi')
const { validate, defaultErrorHandler } = require('aevm')

const app = require('express')
const router = app.Router()

const schema = Joi.object().keys({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(12).max(80).required()
  })
}).unknown()

router.post('/login', validate(schema), (req, res, next) => { /* You code here */ })

app.use('/api', router)

app.use(defaultErrorHandler)
app.listen(3000)
```

__Now if you provide bad data:__
```json
{
  "email": "wrong_email",
  "password": "tooshort"
}
```

__It will response with the following error__:
```json
{ "message": "'email' must be a valid email" }
```

## Settings:
The default behaviour is passing `{ httpCode: 400, message: 'error messages' }` to `next()` function. So you need to write your error handler middleware or just use the default `defaultErrorHandler` which is nothing more then:
```js
function (err, req, res, next) {
  if (process.env.NODE_ENV !== 'production') console.log(err)
  res.status(err.httpCode || 500).json({ message: err.message })
}
```

If you want just response to client use `validateWithResponse`:
```js
const validate = require('joi-middleware').validateWithResponse
router.post('/login', validate(schema), (req, res, next) => { /* Handle login */ })
```
