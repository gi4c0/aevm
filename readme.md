
# Table of Contents

1.  [Another Joi validator middleware](#org1514d00)
    1.  [Motivation](#orge5aa18b)
    2.  [Getting started](#org0eb743d)
        1.  [Simple usecase](#orgf591e86)
    3.  [API](#org24887a0)
        1.  [Schema](#org5332563)
        2.  [validate(validationSchema)](#orgac9b17a)
        3.  [paramId(paramName: string)](#orgcfb69f7)
        4.  [queryId(paramName: string)](#orga870f9d)
        5.  [queryString(paramName: string)](#org764185c)
        6.  [getErrorMessage(req, schema)](#org3b6f285)
        7.  [validateWithResponse(schema)](#org288dfe4)
        8.  [defaultErrorHandler (DEPRECATED)](#org12ad5b9)


<a id="org1514d00"></a>

# Another Joi validator middleware


<a id="orge5aa18b"></a>

## Motivation

I tired of writing the same code over and over again with validation middlewares for each new project. So I wrote this little package to not repeat myself.
The idea is quite simple: it just takes you Joi schema and returns an express middleware that validates it against the data from request object


<a id="org0eb743d"></a>

## Getting started


<a id="orgf591e86"></a>

### Simple usecase

    const Joi = require('joi')
    const { validate, defaultErrorHandler } = require('aevm')

    const app = require('express')
    const router = app.Router()

    const schema = {
      body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(12).max(80).required(),
        country: Joi.string().default('Ukraine')
      })
    }

    router.post('/login', validate(schema), (req, res, next) => { /* You code here */ })

    app.use('/api', router)

    app.use((err, req, res, next) => {
      res.status(err.httpCode || 500).json({ message: err.message })
    })

    app.listen(3000)

Now if you provide bad data:


    {
      "email": "wrong_email",
      "password": "tooshort"
    }

It will response with the following error:

    { "message": "'email' must be a valid email" }

Default values specified in schema would be placed in the request object

    console.log(req.body.country) // 'Ukraine'


<a id="org24887a0"></a>

## API


<a id="org5332563"></a>

### Schema

Any validation schema in this package must have the following structure:

    interface IUserSchema {
      body?: Joi.ObjectSchema
      query?: Joi.ObjectSchema
      params?: Joi.ObjectSchema
      headers?: Joi.ObjectSchema
    }

So basically it's an object with possible keys `body`, `query`, `params`, `headers` with values of Joi.object().keys()
Obviously at least one key is required


<a id="orgac9b17a"></a>

### validate(validationSchema)

Takes an object with keys `body`, `query`, `params`, `headers` and values Joi.object().keys() and returns an express middleware that will validate the data and pass an error to next() function if there is any
Error would be { httpCode: number, message: string }.


<a id="orgcfb69f7"></a>

### paramId(paramName: string)

Takes a string and creates a schema with a single validation numeric field for the `req.params` object and returns an express validation middleware
Could be usefull for when you need to validate an id from url like `GET /users/:userId`


<a id="orga870f9d"></a>

### queryId(paramName: string)

Takes a string and creates a schema with a single validation numeric field for the `req.query` object and returns an express validation middleware


<a id="org764185c"></a>

### queryString(paramName: string)

Takes a string and creates a schema with a single validation string field for the `req.query` object and returns an express validation middleware


<a id="org3b6f285"></a>

### getErrorMessage(req, schema)

Takes a `req` object and schema and returns error message with default values for custom validation middleware
`Returned values`:

    {
      message: 'you error message or empty string',
      values: { /* Object with data from your schema populated with defualt values */ }
    }


<a id="org288dfe4"></a>

### validateWithResponse(schema)

Takes schema and returns an express middleware that would automatically response with error code 400 end message in JSON like `{ "message": "your error" }`


<a id="org12ad5b9"></a>

### defaultErrorHandler (DEPRECATED)

The default error handler that could be used to respond with error from middleware that came from `validate` method
