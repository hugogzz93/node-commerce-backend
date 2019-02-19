
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users_products', table => {
    table.increments('id').primary()
    table.integer('user_id').unsigned().notNullable()
    table.integer('product_id').unsigned().notNullable()
    table.foreign('user_id').references('users.id')
    table.foreign('product_id').references('products.id')
  })
  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users_products')
};
