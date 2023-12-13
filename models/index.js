const User = require('./User');
// const Project = require('./Project');
const Reservation = require('./Reservations');

User.hasMany(Reservation, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Reservation.belongsTo(User, {
  foreignKey: 'user_id'
});

module.exports = { User, Reservation };
