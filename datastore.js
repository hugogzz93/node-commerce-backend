import sequelize from 'sequelize'

const connection = new sequelize('dev_search', 'hugo', '', {
  dialect: 'postgres'
})

const Product = connection.define('product', {
  name: {
    type: sequelize.STRING,
    unique: true,
    allowNull: false
  },
  description: sequelize.STRING
})

const User = connection.define('user', {
  name: sequelize.STRING,
  email: sequelize.STRING
})

connection.sync({
  force: true
}).then(() => {
  const products = [
    {name: 'Steel', description: 'Strong, conducts Electricity'},
    {name: 'Wood', description: 'Brittle, grows on trees.'},
    {name: 'Plastic', description: 'Cheap, pollutant'},
    {name: 'Rock', description: 'Hard to work with'}
  ]

  const users = [
    {name: 'hugo', email: 'pinelo93@gmail.com'},
    {name: 'gonzales', email: 'gonzales@gmail.com'},
    {name: 'marcelo', email: 'marcelo@gmail.com'}
  ]
  
  Product.bulkCreate(products)
  User.bulkCreate(users)
  // products.forEach(product => {
  //   Product.create(product)
  // })
  //
  // users.forEach(user => {
  //   User.create(user)
  // })
})
