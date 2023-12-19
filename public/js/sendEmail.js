const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.mailerEmail,
    pass: process.env.mailerPassword,
  },
});

const sendConfirmation = () => {
//   router.post("/confirm-reservation", (req, res) => {
    const userEmail = req.session.user.email;
    const userName = req.session.user.name;
    const mailOptions = {
      from: process.env.mailerEmail,
      to: userEmail,
      subject: "Reservation Confirmation",
      text: `Thank you ${userName}, your reservation has been confirmed!`,
      html: 
      `
      Thank you
      `
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).send("Email sent");
      }
    });
//   });
};
