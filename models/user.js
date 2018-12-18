import sequelize from 'sequelize'

const createUser = (connection, sequelize) => {
  const User = connection.define('User', {
    name: sequelize.STRING,
    email: sequelize.STRING,
    password: sequelize.STRING,
    password_salt: sequelize.STRING,
    auth_token: sequelize.STRING,
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    // not working
  };
  return User;
};

export { createUser }