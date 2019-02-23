'use strict'
const test = require('ava')
const MailGun = require('../lib/MailGun')
const axios = require('axios')
const sinon = require('sinon')

test.before('load configuration', t => {
  console.log('loading test configuration from .env.test')
  if (process.env.NODE_ENV === 'test') {
    require('dotenv').config({ path: `${process.cwd()}/.env.test` })
  }
  sinon.stub(axios, 'request').callsFake(async request => {
    if (request.params.subject === 'failme') {
      throw new Error('API call failed.')
    }
  })
})

test.after(t => {
  sinon.restore()
})

test('test can instantiate MailGun', t => {
  const sg = new MailGun()
  t.true(sg instanceof MailGun)
})

test('test client will push the mail object successfully', async t => {
  const mg = new MailGun()
  const response = await mg.send({
    content: 'content',
    subject: 'success',
    to: ['to@mail.com'],
    from: 'me@mail.com'
  })
  t.deepEqual(response, {
    message: 'Email processed successfully.'
  })
})

test('test client will push the mail object and fail', async t => {
  const mg = new MailGun()
  await t.throwsAsync(async () => {
    await mg.send({
      content: 'content',
      subject: 'failme',
      to: ['to@mail.com'],
      from: 'me@mail.com'
    })
  }, { instanceOf: Error, message: 'API call failed.' })
})
