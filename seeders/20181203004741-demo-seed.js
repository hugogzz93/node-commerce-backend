// import User from '../models/user'
// import Product from '../models/product'

// const User = require('../models/user')
// const Product = require('../models/product')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const products = [
      {name: 'Steel', description: 'Strong, conducts Electricity', createdAt: new Date(), updatedAt: new Date()},
      {name: 'Wood', description: 'Brittle, grows on trees.', createdAt: new Date(), updatedAt: new Date()},
      {name: 'Plastic', description: 'Cheap, pollutant', createdAt: new Date(), updatedAt: new Date()},
      {name: 'Rock', description: 'Hard to work with', createdAt: new Date(), updatedAt: new Date()}
    ]

    const users = [
      {name: 'hugo', email: 'pinelo93@gmail.com', createdAt: new Date(), updatedAt: new Date()},
      {name: 'gonzales', email: 'gonzales@gmail.com', createdAt: new Date(), updatedAt: new Date()},
      {name: 'marcelo', email: 'marcelo@gmail.com', createdAt: new Date(), updatedAt: new Date()}
    ]
    
     const userPromise = queryInterface.bulkInsert('Users', users, {})
     const productPromise = queryInterface.bulkInsert('Products', products, {})
     return Promise.all([userPromise, productPromise])

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
