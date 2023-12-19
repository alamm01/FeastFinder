const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Reservation extends Model {}


//attributes?
//booth, table, bar, handicap_accisable, 
//how do we check for availability? for a date and time?



Reservation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    special_request: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    guest_counts: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    date_created: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    date_reserved: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'reservation',
  }
);

module.exports = Reservation;
