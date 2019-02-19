const faker = require('faker')
exports.seed = function(knex, Promise) {
  return knex('users')
    .then(async function () {
       await knex('user_product_items').del()
       await knex('users').del()
       await knex('products').del()
       await knex('users').insert([
         {name: 'hugo', email: 'pinelo93@gmail.com', createdAt: new Date(), updatedAt: new Date(), password: 'test'},
         {name: 'gonzales', email: 'gonzales@gmail.com', createdAt: new Date(), updatedAt: new Date(), password: 'test'},
         {name: 'marcelo', email: 'marcelo@gmail.com', createdAt: new Date(), updatedAt: new Date(), password: 'test'}
      ]);

      await knex('products').insert([
         {name: 'Steel', description: 'Strong, conducts Electricity', createdAt: new Date(), updatedAt: new Date()},
         {name: 'Wood', description: 'Brittle, grows on trees.', createdAt: new Date(), updatedAt: new Date()},
         {name: 'Plastic', description: 'Cheap, pollutant', createdAt: new Date(), updatedAt: new Date()},
         {name: 'Rock', description: 'Hard to work with', createdAt: new Date(), updatedAt: new Date()}
      ]);

      const users = await knex('users').select('id')
      const products = await knex('products').select('id')

      return knex('user_product_items').insert([
        {name: faker.commerce.productName(), price: 30, user_id: users[0].id, product_id: products[0].id},
        {name: faker.commerce.productName(), price: 50, user_id: users[0].id, product_id: products[0].id},
        {name: faker.commerce.productName(), price: 80, user_id: users[1].id, product_id: products[0].id},
      ])
    });
};
