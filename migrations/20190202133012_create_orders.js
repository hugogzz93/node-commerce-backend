
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('orders', table => {
      table.increments('id').primary()
      table.integer('user_id')
      table.float('total')
      table.foreign('user_id').references('users.id')
      table.timestamp('createdAt')
      table.timestamp('updatedAt')
    }),
    knex.schema.createTable('orders_user_product_items', table => {
      table.increments('id').primary()
      table.integer('order_id')
      table.integer('user_product_item_id')
      table.foreign('order_id').references('orders.id')
      table.foreign('user_product_item_id').references('user_product_items.id')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('orders'),
    knex.schema.dropTable('orders_user_product_items')
  ])
  
};
