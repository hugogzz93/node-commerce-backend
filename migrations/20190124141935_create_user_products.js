
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_product_items', table => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('image')
    table.integer('stock').notNullable().default(0)
    table.float('price').notNullable()
    table.integer('user_id').unsigned().notNullable()
    table.integer('product_id').unsigned().notNullable()
    table.foreign('user_id').references('users.id')
    table.foreign('product_id').references('products.id')
    table.unique(['name', 'user_id'])
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user_product_items')
};
