'use strict'
const test = require('ava')
const SendGrid = require('../lib/SendGrid')
const axios = require('axios')
const sinon = require('sinon')

test.before('load configuration', t => {
  console.log('loading test configuration from .env.test')
  if (process.env.NODE_ENV === 'test') {
    require('dotenv').config({ path: `${process.cwd()}/.env.test` })
  }
  sinon.stub(axios, 'request').callsFake(async request => {
    if (request.data.subject === 'failme') {
      throw new Error('API call failed.')
    }
  })
})

test.after(t => {
  sinon.restore()
})

test('test can instantiate SendGrid', t => {
  const sg = new SendGrid()
  t.true(sg instanceof SendGrid)
})

test('test client will push the mail object successfully', async t => {
  const sg = new SendGrid()
  const response = await sg.send({
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
  const sg = new SendGrid()
  await t.throwsAsync(async () => {
    await sg.send({
      content: 'content',
      subject: 'failme',
      to: ['to@mail.com'],
      from: 'me@mail.com'
    })
  }, { instanceOf: Error, message: 'API call failed.' })
})
