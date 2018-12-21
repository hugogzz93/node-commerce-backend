// import User from '../models/user'
// import Product from '../models/product'

// const User = require('../models/user')
// const Product = require('../models/product')

module.exports = {
  up: (queryInterface, Sequelize) => {

     return Promise.all([

       queryInterface.bulkInsert('Users', [
         {name: 'hugo', email: 'pinelo93@gmail.com', createdAt: new Date(), updatedAt: new Date(), password: 'test'},
         {name: 'gonzales', email: 'gonzales@gmail.com', createdAt: new Date(), updatedAt: new Date(), password: 'test'},
         {name: 'marcelo', email: 'marcelo@gmail.com', createdAt: new Date(), updatedAt: new Date(), password: 'test'}
       ] , {}),

       queryInterface.bulkInsert('Products',[
         {name: 'Steel', description: 'Strong, conducts Electricity', createdAt: new Date(), updatedAt: new Date()},
         {name: 'Wood', description: 'Brittle, grows on trees.', createdAt: new Date(), updatedAt: new Date()},
         {name: 'Plastic', description: 'Cheap, pollutant', createdAt: new Date(), updatedAt: new Date()},
         {name: 'Rock', description: 'Hard to work with', createdAt: new Date(), updatedAt: new Date()}
       ], {}),

       queryInterface.bulkInsert('UserProducts', [
        {user_id: 1, product_id: 1, createdAt: new Date(), updatedAt: new Date()},
        {user_id: 2, product_id: 1, createdAt: new Date(), updatedAt: new Date()},
        {user_id: 3, product_id: 1, createdAt: new Date(), updatedAt: new Date()},
        {user_id: 1, product_id: 2, createdAt: new Date(), updatedAt: new Date()},
        {user_id: 2, product_id: 2, createdAt: new Date(), updatedAt: new Date()}
       ])

     ])

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
