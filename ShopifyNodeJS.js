const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

// Create an instance of express and body-parser
const app = express();
app.use(bodyParser.json());

// Your Shopify app credentials
const appKey = '30272c0ac299867d96c578a84aaf59b2';
const appSecret = '79084b96b2c12d0af29370756412844a';
const accessToken = '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';

// Your NetSuite RESTlet endpoint URL
const endpointURL = 'https://tstdrv2525368.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=1141&deploy=1';

// Your NetSuite RESTlet credentials
const consumerKey = 'e51be5af68d95aac330ee421a4759a4e275ba47c66c57de6cbf8930c6af17f3a';
const consumerSecret = '60acd075ceab0b271481f70870983a392f8ed4615c38e113139771851d743876';
const token = 'c4e8dc5cc7ca3fb583f71885d94ea754118a0fd9d2a1c8f8cbfc55435c9d8c19';
const tokenSecret = '091d87ea774ad3f6309c55a00860f07e7b1d09f2431491e0b01cd5eee6aa2fb4';

app.post('/webhooks/orders/create', (req, res) => {
  // Verify that the request is from Shopify
  const shopifyHmac = req.headers['x-shopify-hmac-sha256'];
  const digest = crypto.createHmac('sha256', appSecret).update(req.body).digest('base64');

  if (digest !== shopifyHmac) {
    return res.status(401).send('Unauthorized request');
  }

  // Extract the order data from the request body
  const order = req.body;

  // Send the order data to the NetSuite RESTlet
  const options = {
    method: 'POST',
    url: endpointURL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `OAuth oauth_consumer_key=${consumerKey}, oauth_token=${token}, oauth_signature_method=PLAINTEXT, oauth_signature=${consumerSecret}%26${tokenSecret}, oauth_realm=TSTDRV2525368`,
      },
    body: JSON.stringify({
      order: order
    })
  };

  request(options, function (error, response) { 
    if (error) {
      console.error(error);
    } else {
      console.log(response.body);
    }
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

