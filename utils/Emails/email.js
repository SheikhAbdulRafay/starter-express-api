const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const config = require("../../config/config");
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: 465,
  secure: true,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});
exports.email = (payload) => {
  console.log("in urils/email.js", payload);

  const mailOptions = {
    from: config.email.user,
    to: "rafaykhan922@gmail.com",
    subject: payload.subject,
    ...(payload.isHtml ? { html: payload.html } : { text: payload.text }),
    attachments: payload.attachments,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

