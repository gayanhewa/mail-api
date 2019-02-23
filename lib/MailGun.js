'use strict'
const { MailerInterface } = require('./Interfaces')
const axios = require('axios')

class MailGun extends MailerInterface {
  constructor () {
    super()
    if (process.env.MAILGUN_DOMAIN === '' || process.env.MAILGUN_USERNAME === '' || process.env.MAILGUN_API_KEY === '') {
      throw new Error('Unable to configure MailGun, missing configuration.')
    }
    axios.defaults.baseURL = `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`
    axios.defaults.auth = {
      username: process.env.MAILGUN_USERNAME,
      password: process.env.MAILGUN_API_KEY
    }
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  async send (options) {
    await axios({
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
