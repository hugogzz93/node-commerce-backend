import sequelize from 'sequelize'
import { createUser } from './models/user'
import { createProduct } from './models/product'

const createStore = () => {
  const connection = new sequelize('dev_search', 'hugo', '', {
    dialect: 'postgres'
  })

  const Product = createProduct(connection, sequelize)
  const User = createUser(connection, sequelize)

  return { User, Product }
}

export { createStore };
