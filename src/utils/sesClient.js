const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = "eu-north-1";
// Create SES service object.
const sesClient = new SESClient({
  region: REGION,
  credenntials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]
