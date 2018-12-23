import sequelize from 'sequelize'
import bcrypt from 'bcrypt'

const saltRounds = 10
const encryptUser = async (user) => {
  const changes = user.changed()
  if(changes && changes.includes('password')) {
    const salt = await bcrypt.genSalt(saltRounds)
    user.password = await bcrypt.hash(user.password, salt)
  }
  return user
}
const createUser = (connection, sequelize) => {
  const User = connection.define('User', {
    name: sequelize.STRING,
    email: sequelize.STRING,
    password: sequelize.STRING,
    password_salt: sequelize.STRING,
    auth_token: sequelize.STRING,
    phone: sequelize.STRING,
    country: sequelize.STRING,
    city: sequelize.STRING,
    street: sequelize.STRING,
    street_2: sequelize.STRING,
    street_number: sequelize.STRING,
    zipcode: sequelize.STRING,
    description: sequelize.TEXT
  }, {
    hooks: {
      beforeSave: async (user, options) => {
        user = await encryptUser(user)
      },
    }
  });

  User.prototype.allowsModificationsFrom = function({auth_token}) {
    // throw `${auth_token} != ${this.dataValues.auth_token}`
    return auth_token == this.dataValues.auth_token
  }

  return User;
};

export { createUser }
