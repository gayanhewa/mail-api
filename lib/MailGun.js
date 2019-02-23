'use strict'
const { MailerInterface } = require('./Interfaces')
const axios = require('axios')

class MailGun extends MailerInterface {
  constructor () {
    super()
    if (!process.env.MAILGUN_DOMAIN || !process.env.MAILGUN_USERNAME || !process.env.MAILGUN_API_KEY) {
      throw new Error('Unable to configure MailGun, missing configuration.')
    }
    this.baseUrl = `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}`
  }
  async send (options) {
    await axios.request({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      url: '/messages',
      auth: {
        username: process.env.MAILGUN_USERNAME,
        password: process.env.MAILGUN_API_KEY
      },
      method: 'POST',
      params: this._getMailableObject(options)
    })
    console.log('Email processed with mailgun.')
    return { message: 'Email processed successfully.' }
  }
  _getMailableObject (options) {
    return {
      from: options.from,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      text: options.content
    }
  }
}

module.exports = MailGun
