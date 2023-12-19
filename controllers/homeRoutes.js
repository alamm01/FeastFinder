//user's landing page, no auth needed
//what do we display in the homepage?
//Name and log of the resturant, part of the main handlebar
//


const router = require('express').Router();
// const { Reservation } = require('../models');
const { Reservation, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Pass only the session flag (logged_in status) into the template
    res.render('homepage', { 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/reservation/:id', withAuth, async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const project = projectData.get({ plain: true });

    res.render('project', {
      ...project,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

function onPageLoad(){
  router.get('/profile', async (req, res) => {
    try {
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Reservation }],
      });
  
      const userInfo = userData.get({ plain: true });
      console.log(userInfo, "testttt");
      res.render('profile', {
        ...userInfo,
        logged_in: true
      });
    } catch (err) {
      console.log(err);
      res.status(600).json(err);
    }
    
  });
}



// router.get('/profile', async (req, res) => {

//   console.log(req);
//   try {
//     const userData = await User.findByPk(req.session.user_id, {
//       attributes: { exclude: ['password'] },
//       include: [{ model: Reservation }],
//     });

//     const userInfo = userData.get({ plain: true });
//     console.log(userInfo, "testttt");
//     res.render('profile', {
//       ...userInfo,
//       logged_in: true
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(600).json(err);
//   }
  
// });












router.get('/profile', async (req, res) => {
  try {
    console.log("Session User ID:", req.session.user_id);

    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Reservation }],
    });

    if (!userData) {
      console.log(`User not found with ID: ${req.session.user_id}`);
      return res.status(404).send('User not found');
    }
    let resData;
    let allresData;
    if (userData.is_admin){
      resData = await Reservation.findAll();
      allresData = resData.map(reservation => reservation.get ({ plain: true}));
    }
    console.log(allresData);

    const userInfo = userData.get({ plain: true });
    console.log("User Info:", userInfo);

    res.render('profile', {
      ...userInfo,
      allresData,
      logged_in: true
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json(err);
  }
});













// console.log(userInfo, "testttt");

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

// window.onload = onPageLoad

module.exports = router;
