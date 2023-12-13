const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Seating extends Model {}

//the purpose of this table is to contain all the resource availability information
//we substract resrouce from the table when reservation is made, and we add when cancellation
//date and time?
//, booth, 8 guests




Seating.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    date_created: {
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
    modelName: 'seating',
  }
);

module.exports = Seating;
