module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL || {database: 'dev_search', name: 'hugo'}
}
