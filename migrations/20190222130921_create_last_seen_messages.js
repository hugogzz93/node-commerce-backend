
exports.up = function(knex, Promise) {
  return knex.schema.createTable('last_seen_messages', table => {
    table.increments('id').primary()
    table.integer('user_id').notNullable()
    table.foreign('user_id').references('users.id')
    table.integer('issue_id').notNullable()
    table.foreign('issue_id').references('issues.id')
    table.integer('issue_message_id').notNullable()
    table.foreign('issue_message_id').references('issue_messages.id')
    table.timestamp('createdAt').notNullable()
    table.timestamp('updatedAt').notNullable()
  })
  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('last_seen_messages')
};
