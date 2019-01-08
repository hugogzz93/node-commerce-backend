
exports.seed = function(knex, Promise) {
  return knex('products').del()
    .then(function () {
      return knex('products').insert([
         {name: 'Steel', description: 'Strong, conducts Electricity', createdAt: new Date(), updatedAt: new Date()},
         {name: 'Wood', description: 'Brittle, grows on trees.', createdAt: new Date(), updatedAt: new Date()},
         {name: 'Plastic', description: 'Cheap, pollutant', createdAt: new Date(), updatedAt: new Date()},
         {name: 'Rock', description: 'Hard to work with', createdAt: new Date(), updatedAt: new Date()}
      ]);
    });
};
