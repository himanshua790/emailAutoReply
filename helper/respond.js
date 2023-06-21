require("dotenv").config();
const { Buffer } = require("buffer");
const { google } = require("googleapis");

const EMAIL_LABEL = "Vacation Auto-reply";

async function respondToEmails(auth) {
  const gmail = google.gmail({ version: "v1", auth });

  const listRes = await gmail.users.messages.list({
    userId: "me",
    q: "is:unread label:inbox -category:chats -category:promotions -in:sent",
    maxResults: 5,
  });

  const messages = listRes.data.messages;
  if (!messages || messages.length === 0) {
    console.log("No new emails.");
    return;
  }
  let success = 0;
  for (const message of messages) {
    const messageRes = await gmail.users.messages.get({
      userId: "me",
      id: message.id,
    });

    const threadId = messageRes.data.threadId;

    const threadRes = await gmail.users.threads.get({
      userId: "me",
      id: threadId,
    });

    const thread = threadRes.data;
    const hasReplies = thread.messages && thread.messages.length > 1;

    if (!hasReplies) {
      const email = messageRes.data;
      const emailTo = email.payload.headers.find(
        (header) => header.name === "From"
      ).value;
      const emailContent = `Dear Sender, Thank you for your email. I'm currently on vacation and will have limited access to my emails until 12 July 2023. During this time, I may not be able to respond promptly. Rest assured that I'll review your email as soon as I return and get back to you at the earliest opportunity. If your inquiry is urgent, please contact pa@roado.co.in at pa@roado.co.in. Thank you for your understanding and patience. Best regards, Himanshu Soni `;

      const emailSubject = `Auto-Reply: Out of Office - Vacation Notice`;

      // Add the original email's message ID as a reference for the reply
      const reply = {
        subject: emailSubject,
        to: emailTo,
        threadId: threadId,
        message: emailContent,
      };
      success += 1;
      await sendReply(auth, reply);
      await addLabel(gmail, message.id, EMAIL_LABEL);
    }
  }
  return `Batch Completed of ${success}/${
    messages?.length
  } messages! --- ${new Date()} `;
}

async function sendReply(auth, reply) {
  const gmail = google.gmail({ version: "v1", auth });

  const messageParts = [
    `From:${process.env.EMAIL}`,
    `To: ${reply.to}`,
    `Subject: ${reply.subject}`,
    "Content-Type: text/plain; charset=utf-8",
    "",
    reply.message,
  ];

  const message = messageParts.join("\n");

  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
      threadId: reply.threadId,
    },
  });

  console.log("Reply sent!");
}

async function addLabel(gmail, messageId, labelName) {
  const labelRes = await gmail.users.labels.list({ userId: "me" });
  const labels = labelRes.data.labels;
  const label = labels.find((label) => label.name === labelName);

  if (label) {
    await gmail.users.messages.modify({
      userId: "me",
      id: messageId,
      requestBody: {
        addLabelIds: [label.id],
      },
    });
  } else {
    const createLabelRes = await gmail.users.labels.create({
      userId: "me",
      requestBody: {
        name: labelName,
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
      },
    });

    await gmail.users.messages.modify({
      userId: "me",
      id: messageId,
      requestBody: {
        addLabelIds: [createLabelRes.data.id],
      },
    });
  }
}

module.exports = {
  respondToEmails,
};
