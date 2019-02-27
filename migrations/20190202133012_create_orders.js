
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('order_groups', table => {
      table.increments('id').primary()
      table.integer('client_id').notNullable()
      table.foreign('client_id').references('users.id')
      table.timestamp('createdAt')
      table.timestamp('updatedAt')
    }),
    knex.schema.createTable('orders', table => {
      table.increments('id').primary()
      table.enu('status', ['in_progress','in_transit', 'delivered', 'canceled']).default('in_progress')
      table.integer('client_id').notNullable()
      table.foreign('client_id').references('users.id')
      table.integer('vendor_id').notNullable()
      table.foreign('vendor_id').references('users.id')
      table.integer('order_group_id')
      table.foreign('order_group_id').references('order_groups.id').onDelete('cascade')
      table.timestamp('createdAt')
      table.timestamp('updatedAt')
    }),
    knex.schema.createTable('order_items', table => {
      table.increments('id').primary()
      table.integer('order_id').notNullable()
      table.integer('user_product_item_id')
      table.float('price').notNullable()
      table.integer('amount').notNullable()
      table.enu('status', ['pending_mail','transit', 'delivered', 'canceled']).default('pending_mail')
      table.foreign('order_id').references('orders.id').onDelete('cascade')
      table.foreign('user_product_item_id').references('user_product_items.id').onDelete('set null')
    }),
    knex.schema.createTable('tracking_numbers', table => {
      table.increments('id').primary()
      table.string('value').notNullable()
      table.integer('order_id').notNullable()
      table.foreign('order_id').references('orders.id')
      table.timestamp('createdAt')
      table.timestamp('updatedAt')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('tracking_numbers'),
    knex.schema.dropTable('order_items'),
    knex.schema.dropTable('orders'),
    knex.schema.dropTable('order_groups')
  ])
};
