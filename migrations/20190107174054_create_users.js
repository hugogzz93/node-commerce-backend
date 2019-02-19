
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary()
    table.string('name').unique()
    table.string('email').unique().notNullable()
    table.string('auth_token').unique()
    table.string('phone')
    table.string('country')
    table.string('city')
    table.string('street')
    table.string('street_2')
    table.string('street_number')
    table.string('zipcode')
    table.text('description')
    table.string('password')
    table.string('password_salt')
    table.timestamp('createdAt')
    table.timestamp('updatedAt')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
