import sequelize from 'sequelize'
import { createUser } from './models/user'
import { createProduct } from './models/product'
import { createUserProducts } from './models/userproduct'

const createStore = () => {
  const connection = new sequelize('dev_search', 'hugo', '', {
    dialect: 'postgres'
  })

  const Product = createProduct(connection, sequelize)
  const User = createUser(connection, sequelize)
  const UserProducts = createUserProducts(connection, sequelize)
  
  // User.hasMany(UserProducts, {foreignKey: 'user_id'})
  // Product.hasMany(UserProducts, {foreignKey: 'product_id'})
  User.belongsToMany(Product, {
    through: 'UserProducts',
    foreignKey: 'user_id',
    otherKey: 'product_id',
    as: 'products'
  })

  Product.belongsToMany(User, {
    through: 'UserProducts',
    foreignKey: 'product_id',
    otherKey: 'user_id',
    as: 'users'
  })

  return { User, Product, UserProducts, models: connection.models }

}

export { createStore };
