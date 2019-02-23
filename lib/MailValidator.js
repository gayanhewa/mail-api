'use strict'
const { ValidatorInterface } = require('./Interfaces')

class MailValidator extends ValidatorInterface {
  constructor (validator, data = {}) {
    super()
    this._validator = validator
    this.data = data
    this.schema = {
      content: this._validator.string().required(),
      subject: this._validator.string().required(),
      from: this._validator.string().email().label('from').required(),
      to: this._validator.array().items(this._validator.string().email().label('to')).required(),
      cc: this._validator.array().items(this._validator.string().email().label('cc')),
      bcc: this._validator.array().items(this._validator.string().email().label('bcc'))
    }
  }
  validate () {
    let result = this._validator.validate(this.data, this.schema, { abortEarly: false })
    if (result.error !== null) {
      return this._format(result)
    }
  }
  _format (errors) {
    this._errors = errors
    let errMsgs = errors
      .error
      .details
      .map((e) => {
        return e.message
      })
    return {
      message: 'Validation failed.',
      errors: errMsgs
    }
  }
}

module.exports = MailValidator
