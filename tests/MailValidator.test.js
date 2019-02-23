'use strict'
const test = require('ava')
const MailValidator = require('../lib/MailValidator')
const { ValidatorInterface } = require('../lib/Interfaces')
const Joi = require('joi')

test('test can instantiate validator', t => {
  const mv = new MailValidator(Joi)
  t.true(mv instanceof MailValidator)
  t.true(mv instanceof ValidatorInterface)
})

test('test invalid from email', t => {
  const mv = new MailValidator(Joi, {
    from: 'invalidemail.com',
    to: ['valid@mail.com'],
    subject: 'subject',
    content: 'content'
  })
  t.is(mv.validate().message, 'Validation failed.')
})

test('test valid email object', t => {
  const mv = new MailValidator(Joi, {
    from: 'invalid@email.com',
    to: ['valid@mail.com'],
    subject: 'subject',
    content: 'content'
  })
  t.is(mv.validate(), undefined)
})

test('test email object to field is not an array of emails', t => {
  const mv = new MailValidator(Joi, {
    from: 'invalid@email.com',
    to: ['valid@mail.com', 'somebrokenemail.com'],
    subject: 'subject',
    content: 'content'
  })
  t.is(mv.validate().message, 'Validation failed.')
})

test('test to field must be an array', t => {
  const mv = new MailValidator(Joi, {
    from: 'invalid@email.com',
    to: 'valid@mail.com',
    subject: 'subject',
    content: 'content'
  })
  t.is(mv.validate().message, 'Validation failed.')
})

test('test cc field must be an array', t => {
  const mv = new MailValidator(Joi, {
    from: 'invalid@email.com',
    to: 'valid@mail.com',
    cc: 'another@mail.com',
    subject: 'subject',
    content: 'content'
  })
  t.is(mv.validate().message, 'Validation failed.')
})

test('test bcc field must be an array', t => {
  const mv = new MailValidator(Joi, {
    from: 'invalid@email.com',
    to: 'valid@mail.com',
    bcc: 'another@mail.com',
    subject: 'subject',
    content: 'content'
  })
  t.is(mv.validate().message, 'Validation failed.')
})

test('test valid email object with cc and bcc', t => {
  const mv = new MailValidator(Joi, {
    from: 'invalid@email.com',
    to: ['valid@mail.com'],
    cc: ['another-cc@mail.com'],
    bcc: ['another@mail.com'],
    subject: 'subject',
    content: 'content'
  })
  t.is(mv.validate(), undefined)
})
