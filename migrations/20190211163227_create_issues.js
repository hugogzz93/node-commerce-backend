
exports.up = function(knex, Promise) {
  return Promise.all([
  knex.schema.createTable('issues', table => {
    table.increments('id').primary()
    table.integer('order_id').notNullable()
    table.foreign('order_id').references('orders.id')
    table.integer('creator_id')
    table.foreign('creator_id').references('users.id')
    table.integer('attendee_id')
    table.foreign('attendee_id').references('users.id')
    table.enu('status', ['open', 'closed']).default('open')
    table.timestamp('createdAt')
    table.timestamp('updatedAt')
  }),
  knex.schema.createTable('issue_messages', table => {
    table.increments('id').primary()
    table.text('body').notNullable()
    table.integer('issue_id').notNullable()
    table.integer('author_id').notNullable()
    table.foreign('issue_id').references('issues.id').onDelete('cascade')
    table.foreign('author_id').references('users.id')
    table.timestamp('createdAt')
    table.timestamp('updatedAt')
  })])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('issue_messages'),
    knex.schema.dropTable('issues'),
  ])
};
