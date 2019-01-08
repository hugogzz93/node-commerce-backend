
exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
         {name: 'hugo', email: 'pinelo93@gmail.com', createdAt: new Date(), updatedAt: new Date(), password: 'test'},
         {name: 'gonzales', email: 'gonzales@gmail.com', createdAt: new Date(), updatedAt: new Date(), password: 'test'},
         {name: 'marcelo', email: 'marcelo@gmail.com', createdAt: new Date(), updatedAt: new Date(), password: 'test'}
      ]);
    });
};
