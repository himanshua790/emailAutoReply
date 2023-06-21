require("dotenv").config();
const express = require("express");
const fs = require("fs");
const { google } = require("googleapis");
const { authorize } = require("./helper/login");
const { respondToEmails } = require("./helper/respond");
const { getRandomInterval, errorHandler } = require("./helper/misc");

const app = express();
const port = process.env.PORT || 5000;
const credentials = require("./credentials.json");

// Run route to initiate auto response
app.get("/run", async (req, res, next) => {
  try {
    // Check Auth of user
    const auth = await authorize(credentials);

    // providing logs to user
    const sendResponse = (data) => {
      console.log(data);
      res.write(`data: ${JSON.stringify(data)}\n\n</br>`);
    };
    res.setHeader("Content-Type", "text/html");

    // Handles the main functionality of Email reply
    // Run respondToEmails in random interval of defined period
    const interval = setInterval(async () => {
      const response = await respondToEmails(auth);
      sendResponse(response);
    }, getRandomInterval());

    // Terminates the functionality of email reply when /run page is closed
    res.on("close", () => {
      clearInterval(interval);
      console.log("API connection closed!\nSee you again!🚀");
    });
  } catch (error) {
    next(error);
  }
});

// Login, to authorize the user
app.get("/login", (_, res, next) => {
  try {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/gmail.modify"],
    });

    res.redirect(authUrl);
  } catch (error) {
    next(error);
  }
});

// Callback route for saving token in local
app.get("/callback", async (req, res, next) => {
  try {
    const code = req.query.code;

    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    const token = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(token.tokens);

    fs.writeFileSync("token.json", JSON.stringify(token.tokens));

    res.send(
      "Authentication successful!</br>Wait for 15 seconds then</br>To start autoresponse, trigger <host>/run"
    );
  } catch (error) {
    next(error);
  }
});

// Error handler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
