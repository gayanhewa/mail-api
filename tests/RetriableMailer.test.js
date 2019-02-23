'use strict'
const test = require('ava')
const RetriableMailer = require('../lib/RetriableMailer')
const SendGrid = require('../lib/SendGrid')
const MailGun = require('../lib/MailGun')
const sinon = require('sinon')

test.before('load configuration', t => {
  console.log('loading test configuration from .env.test')
  if (process.env.NODE_ENV === 'test') {
    require('dotenv').config({ path: `${process.cwd()}/.env.test` })
  }
  sinon.stub(SendGrid.prototype, 'send').callsFake(async (mailer) => {
    if (mailer.to[0] === 'fail-sendgrid@mail.com' || mailer.to[0] === 'fail-all@mail.com') {
      throw new Error('Error processing sendgrid emails.')
    }
    return { message: 'Email processed successfully.' }
  })
  sinon.stub(MailGun.prototype, 'send').callsFake(async (mailer) => {
    if (mailer.to[0] === 'fail-mailgun@mail.com' || mailer.to[0] === 'fail-all@mail.com') {
      throw new Error('Error processing mailgun emails.')
    }
    return { message: 'Email processed successfully.' }
  })
})

// restore the stubs
test.after(t => {
  sinon.restore()
})

test('test can instantiate RetriableMailer', t => {
  const rm = new RetriableMailer()
  t.true(rm instanceof RetriableMailer)
})

test('test clientFactory returns correct instance of the Mail client', t => {
  const rm = new RetriableMailer()
  const sendgridClient = rm.clientFactory('sendgrid')
  const mailgunClient = rm.clientFactory('mailgun')
  t.true(rm instanceof RetriableMailer)
  t.true(sendgridClient instanceof SendGrid)
  t.true(mailgunClient instanceof MailGun)
})

test('test send email with retries in the first attempt', async t => {
  const rm = new RetriableMailer()
  const response = await rm.mail({
    content: 'Email body',
    subject: 'Email subject',
    from: 'gayanhewa@gmail.com',
    to: ['my-inbox@mailinator.com']
  })
  t.deepEqual(response, {
    message: 'Email processed successfully.'
  })
})

test('test send email with failover provider', async t => {
  const rm = new RetriableMailer()
  const response = await rm.mail({
    content: 'Email body',
    subject: 'Email subject',
    from: 'gayanhewa@gmail.com',
    to: ['fail-mailgun@mail.com']
  })
  t.deepEqual(response, {
    message: 'Email processed successfully.'
  })
})

test('test retries when both options fail throws an exception', async t => {
  const rm = new RetriableMailer()
  await t.throwsAsync(async () => {
    await rm.mail({
      content: 'Email body',
      subject: 'Email subject',
      from: 'gayanhewa@gmail.com',
      to: ['fail-all@mail.com']
    })
  }, { instanceOf: Error, message: 'Provider error' })
})
