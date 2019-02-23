# Mailer API

Simple email API that allows you to push out emails using either SendGrid or MailGun. Has automatic failover from the default provider to the failover provider based on the configuration (see env.template).

Running the tests:
```
  npm test
```

Deployment:

Currently deployments are done using now.sh, to create a deployment from your local machine ensure that you have the now cli installed and a valid account in hand. Simply type the following in the console and the deployment will get triggered:
```
  $ now
```

The dependent env variables need to be added to now as secrets before deployment, otherwise the deployment would fail. More information can be found https://zeit.co/docs/v2/deployments/environment-variables-and-secrets/.

Here is an example:
```
  $ now secret add SENDGRID_API_KEY 'sendgrid_supersecret_api_key'
```

To view automatic deployments click [here](https://github.com/gayanhewa/mail-api/deployments)

## Test mail boxes registered with the deployment

We are using mailinator for the test mailboxes.
 - my-inbox@mailinator.com https://www.mailinator.com/v3/index.jsp?zone=public&query=my-inbox
 - my-inbox-cc@mailinator.com https://www.mailinator.com/v3/index.jsp?zone=public&query=my-inbox-cc
 - my-inbox-bcc@mailinator.com https://www.mailinator.com/v3/index.jsp?zone=public&query=my-inbox-bcc

## API
To view deployments click [here](https://github.com/gayanhewa/mail-api/deployments)
```
  POST /
```

### Request schema
```
  {
    content: 'required|string',
    subject: 'required|string',
    from: 'required|string|email',
    to: 'required|array[string|email]',
    cc: 'array[string|email]',
    bcc: 'array[string|email]',
  }
```

### Responses
- Accepted response
  - status code - 202
  - status text - Accepted
    ```
    {
      message: 'Email processed successfully.'
    }
    ```

- Error response
  - status code - 400
  - status text - Bad Request
    ```
    {
      message: 'Unabled to process E-mail. | Validation failed.',
      errors: ['Provider error.']
    }
    ```

  - status code - 405
  - status text - Bad Request
    ```
      {
        message: 'Method not allowed',
        errors: ['Method not allowed.']
      }
    ```


### Examples
```curl
curl -X POST \
  https://mail-api-dbi4ri6te.now.sh \
  -H 'Content-Type: application/json' \
  -d '{
    "content": "Email body",
    "subject": "Subject line",
    "from": "gayanhewa@gmail.com",
    "to": [
        "my-inboex@mailinator.com"
    ],
    "cc": [
        "my-inbox-cc@mailinator.com"
    ],
    "bcc": [
        "my-inbox-bcc@mailinator.com"
    ]
}'
```