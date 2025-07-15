const nodemailer = require("nodemailer");
const smtpOptions = require("../config/smtpOptions");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport(smtpOptions);

const createPasswordEmail = async ({ to, subject, text, html }) => {
  // verify connection configuration

  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
      return console.log("Server is not ready to take our messages");
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  const mailData = {
    from: {
      name: "User Management",
      address: "no-reply@wikiprospects.in",
    }, // sender address
    to: to, // list of receivers
    subject: subject,
    text: text ? text : "mail sent",
    html: html ? html : "",
  };

  try {
    // Send mail with defined transport object
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        console.log("Error occured : %s", err);
      } else {
        console.log("Message Sent with ID : %s", info.messageId);
      }
    });
  } catch (error) {
    console.error("Error occurred while sending email: %s", error.message);
  }
};

module.exports = createPasswordEmail;
