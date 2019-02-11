
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('orders', table => {
      table.increments('id').primary()
      table.enu('status', ['in_progress', 'completed', 'canceled']).default('in_progress')
      table.integer('user_id')
      table.float('total')
      table.foreign('user_id').references('users.id')
      table.timestamp('createdAt')
      table.timestamp('updatedAt')
    }),
    knex.schema.createTable('order_items', table => {
      table.increments('id').primary()
      table.integer('order_id')
      table.integer('user_product_item_id')
      table.float('price')
      table.integer('amount')
      table.enu('status', ['pending_mail','transit', 'delivered', 'canceled']).default('pending_mail')
      table.foreign('order_id').references('orders.id').onDelete('cascade')
      table.foreign('user_product_item_id').references('user_product_items.id').onDelete('set null')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('order_items'),
    knex.schema.dropTable('orders')
  ])
  
};
