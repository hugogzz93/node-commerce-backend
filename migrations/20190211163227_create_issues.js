
exports.up = function(knex, Promise) {
  return Promise.all([
  knex.schema.createTable('issues', table => {
    table.increments('id').primary()
    table.integer('order_item_id')
    table.foreign('order_item_id').references('order_items.id')
    table.integer('creator_id')
    table.foreign('creator_id').references('users.id')
    table.integer('attendee_id')
    table.foreign('attendee_id').references('users.id')
    table.enu('status', ['pending', 'resolved', 'failed']).default('pending')
    table.timestamp('createdAt')
    table.timestamp('updatedAt')
  }),
  knex.schema.createTable('issue_messages', table => {
    table.increments('id').primary()
    table.text('body')
    table.integer('issue_id')
    table.integer('author_id')
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
