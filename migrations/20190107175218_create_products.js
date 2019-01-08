
exports.up = function(knex, Promise) {
  return knex.schema.createTable('products', table => {
      table.increments('id').primary()
      table.string('name').unique()
      table.text('description')
      table.timestamp('createdAt')
      table.timestamp('updatedAt')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('products')
};
