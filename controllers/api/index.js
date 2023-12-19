const router = require('express').Router();
const userRoutes = require('./userRoutes');
const reservationRoutes = require('./reservationRoutes');

router.use('/users', userRoutes);
router.use('/reservations', reservationRoutes);

module.exports = router;
