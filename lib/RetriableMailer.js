const SendGrid = require('./SendGrid')
const MailGun = require('./MailGun')

class RetriableMailer {
  // Initialize the class with the number of retries, defaults to 3.
  constructor (retries = 3) {
    this.retries = retries
    this.defaultProvider = process.env.DEFAULT_PROVIDER
    this.failoverProvider = process.env.FAILOVER_PROVIDER
  }

  // Intantiate the available mail clients. Probably can be on its own.
  clientFactory (client) {
    switch (client) {
      case 'sendgrid':
        return new SendGrid()
      case 'mailgun':
        return new MailGun()
      default:
        throw new Error(`${client} is invalid option.`)
    }
  }

  // Retriable mailer is where we attempt to send the email using the default provider and then fallback if it doesn't succeed.
  async mail (message) {
    let defaultProviderAttempts = 0
    let failoverProviderAttempts = 0

    while (this.retries > defaultProviderAttempts) {
      try {
        let client = this.clientFactory(this.defaultProvider)
        return await client.send(message)
      } catch (e) {
        console.log(`${defaultProviderAttempts}/${this.retries} processing email with ${this.defaultProvider} and error ${e.message}`)
        defaultProviderAttempts++
      }
    }

    while (this.retries > failoverProviderAttempts) {
      try {
        let client = this.clientFactory(this.failoverProvider)
        return await client.send(message)
      } catch (e) {
        console.log(`${failoverProviderAttempts}/${this.retries} processing email with ${this.failoverProvider} and error ${e.message}`)
        failoverProviderAttempts++
      }
    }
    throw new Error('Provider error')
  }
}

module.exports = RetriableMailer
