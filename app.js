'use strict'
const { send, json } = require('micro')
const MailValidator = require('./lib/MailValidator')
const RetriableMailer = require('./lib/RetriableMailer')
const dotenv = require('dotenv')

async function handler (req, res) {
  dotenv.config()
  if (req.method !== 'POST') {
    const statusCode = 405
    const data = { error: 'Method not allowed.' }
    return send(res, statusCode, data)
  }
  const body = await json(req)
  const validator = new MailValidator(require('joi'), body)
  const errors = validator.validate()
  if (errors !== undefined) {
    return send(res, 400, errors)
  }
  try {
    const message = await json(req)
    const rm = new RetriableMailer()
    return send(res, 202, await rm.mail(message))
  } catch (e) {
    return send(res, 400, { message: 'Unabled to process E-mail.', errors: [e.message] })
  }
}

module.exports = handler
