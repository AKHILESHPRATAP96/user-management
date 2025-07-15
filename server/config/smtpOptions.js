// const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

const smtpOptions = {
  port: 465, // true for 465, false for other ports
  host: "sandbox.smtp.mailtrap.io",
  auth: {
    user: "9d6a3da3d35a98",
    pass: `7397d098122994`,
  },
  secure: true,
};

module.exports = smtpOptions;
