const nodemailer = require("nodemailer");

const router = require("express").Router();
const { Reservation, User } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    // Pass only the session flag (logged_in status) into the template
    res.render("homepage", {
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/reservation/:id", withAuth, async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const project = projectData.get({ plain: true });

    res.render("project", {
      ...project,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/profile", withAuth, async (req, res) => {
  try {
    // console.log("Session User ID:", req.session.user_id);

    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Reservation }],
    });

    if (!userData) {
      console.log(`User not found with ID: ${req.session.user_id}`);
      return res.status(404).send("User not found");
    }
    let resData;
    let allresData;
    if (userData.is_admin) {
      resData = await Reservation.findAll();
      allresData = resData.map((reservation) =>
        reservation.get({ plain: true })
      );
    }
    console.log(allresData);

    const userInfo = userData.get({ plain: true });
    console.log("User Info:", userInfo);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.mailerEmail,
        pass: process.env.mailerPassword,
      },
    });

    const userEmail = "feastfinder999@gmail.com";
    const userName = userInfo.name;
    const mailOptions = {
      from: process.env.mailerEmail,
      to: userEmail,
      subject: "Reservation Confirmation",
      text: `Thank you ${userName}, your reservation has been confirmed!`,
      html: `Thank you ${userName}, your reservation has been confirmed!`,
    };

    res.render("profile", {
      ...userInfo,
      allresData,
      logged_in: true,
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).send("Email sent");
      }
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/profile");
    return;
  }

  res.render("login");
});

// window.onload = onPageLoad
module.exports = router;
