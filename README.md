# Auto Reply with Gmail

This project allows you to automatically reply to emails with Gmail.

## Description

This project is a Node.js application that enables automatic email response using the Gmail API. It allows users to authenticate with their Gmail accounts, initiate an auto-response mechanism, and respond to incoming emails automatically.

## Libraries and Technologies Used

- Node.js: JavaScript runtime environment for executing server-side code.
- Express.js: Fast and minimalist web application framework for Node.js.
- dotenv: Module for loading environment variables from a `.env` file.
- google-auth-library: Library for authentication with Google APIs.
- googleapis: Official Google client library for interacting with Google APIs.

## Development Dependencies

- eslint: JavaScript linter for maintaining code quality and enforcing coding standards.
- nodemon: Utility tool for monitoring file changes and automatically restarting the Node.js application.

## Getting Started

1. Clone the repository: `git clone <repository-url>`
2. Install the dependencies: `npm install`
3. Set up the required credentials: Follow the instructions in the project's documentation to set up the necessary credentials for the Gmail API.
4. Start the application: `npm run dev`
5. Access the application in your web browser at `http://localhost:5000`.

## Installation

1. Clone the repository.
2. Install the dependencies with `pnpm install`.
3. Create a `credentials.json` file in the root of the project. This file should contain the following information:

```json
{
  {
  "web": {
    "client_id": "",
    "project_id": "",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "",
    "redirect_uris": [],
    "javascript_origins": []
  }
}

}
```

4. Run the project with `pnpm run dev` or `nodemon app.js`.

## Usage

1. Visit `localhost:<PORT>/login`.
2. Select the account that you want to use for auto reply.
3. You will be redirected to `localhost:<PORT>/callback`.
4. Wait for 15 seconds.
5. Visit `localhost:<PORT>/run`.
6. You will now start receiving auto replies to your emails.

## Troubleshooting

- If you get an error when trying to run the project, make sure that you have the correct `credentials.json` file.
- If you are still having problems, please open an issue on the GitHub repository.

## Credits

This project was created by Himanshu Soni.
