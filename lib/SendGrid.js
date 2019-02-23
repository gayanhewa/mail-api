'use strict'
const { MailerInterface } = require('./Interfaces')
const axios = require('axios')

class SendGrid extends MailerInterface {
  constructor () {
    super()
    if (process.env.SENDGRID_API_KEY === '') {
      throw new Error('Unable to configure SendGrid missing SENDGRID_API_KEY')
    }
    axios.defaults.baseURL = 'https://api.sendgrid.com/v3/mail/send'
    axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.SENDGRID_API_KEY}`
    axios.defaults.headers.post['Content-Type'] = 'application/json'
  }
  async send (options) {
    await axios({
      method: 'POST',
      data: this._getMailableObject(options)
    })
    console.log('Email processed with sendgrid.')
    return { message: 'Email processed successfully.' }
  }
  _filterToAddresses (options) {
    let to = options
      .to
      .map(email => {
        return { email: email }
      })
    return to
  }
  _filterBccAddresses (options) {
    let bcc = options
      .bcc
      .map(email => {
        return { email: email }
      })
    return bcc
  }
  _filterCcAddresses (options) {
    let cc = options
      .cc
      .map(email => {
        return { email: email }
      })
    return cc
  }
  _getMailableObject (options) {
    let from = {
      email: options.from
    }
    let recipients = {
      to: this._filterToAddresses(options)
    }
    if (options.bcc !== undefined) {
      recipients.bcc = this._filterBccAddresses(options)
    }
    if (options.cc !== undefined) {
      recipients.cc = this._filterCcAddresses(options)
    }
    let subject = options.subject
    let content = options.content
    return {
      personalizations: [recipients],
      from: from,
      subject: subject,
      content: [{
        type: 'text/plain',
        value: content
      }]
    }
  }
}

module.exports = SendGrid
