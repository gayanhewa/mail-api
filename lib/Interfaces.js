'use strict'
class ValidatorInterface {
  validate () {
    throw new Error('Validate method is not implemented.')
  }
}
class MailerInterface {
  async send (options) {
    throw new Error('Send method is not implemented.')
  }
}

module.exports = { ValidatorInterface, MailerInterface }
