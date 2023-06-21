const { google } = require("googleapis");
const fs = require("fs");

const TOKEN_PATH = "token.json";

async function authorize(credentials) {
  const { client_secret, client_id } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret);

  try {
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } catch (err) {
    throw new Error(
      "token doesn't exists!\n Please use <host>/login to generate token"
    );
  }
}

module.exports = {
  authorize,
};
