const plivo = require('plivo');

const p = plivo.RestAPI({
  authId: process.env.PLIVO_AUTH_ID || 'MAZDY2YZM0ZGFHY2VLMW',
  authToken: process.env.PLIVO_AUTH_TOKEN || 'NmM5YTY5YWJhNDBmMDkxMjI3NGJhNzFhZmI1YmQ2'
});

module.exports = {
  send: (text, contact, countryCode = 91) => {
    const params = {
      src: '919441376207',
      dst: `${countryCode}${contact}`, // Receiver's phone Number with country code
      text, // Your SMS Text Message - English
      // The URL to which with the status of the message is sent
      // url: api + '/auth/v1/smsreport/',
      // method: 'POST' // The method used to call the url
    };
    // Prints the complete response
    return new Promise((resolve, reject) => {
      p.send_message(params, (status, response) => {
        console.log('Status: ', status);
        console.log('API Response:\n', response);
        console.log('Message UUID:\n', response.message_uuid);
        console.log('Api ID:\n', response.api_id);
        if (status >= 400) return reject({ status, response });
        return resolve({ status, response });
      });
    });
  }
};

