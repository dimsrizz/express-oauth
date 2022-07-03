const nodemailer = require("nodemailer");

exports.sendMail = async (options, emailUser) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "874812688904b6",
      pass: "b214fdfe8c5686",
    },
  });

  let messages = await transporter.sendMail({
    from: "SIRUP DIKMEN <baldikmen@gmail.com>", // sender address
    to: emailUser, // list of receivers
    subject: options.subject, // Subject line
    html: options.html, // html body
  });
};
