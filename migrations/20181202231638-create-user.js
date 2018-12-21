'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      auth_token: {
        type: Sequelize.STRING,
        unigue: true
      },
  
      phone: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      street: {
        type: Sequelize.STRING
      },
      street_2: {
        type: Sequelize.STRING
      },
      street_number: {
        type: Sequelize.STRING
      },
      zipcode: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      password: {
        type: Sequelize.STRING
      },
      password_salt: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
