const createUserProducts = (connection, sequelize) => {
  const UserProducts = connection.define('UserProducts', {
    user_id: sequelize.INTEGER,
    product_id: sequelize.INTEGER
  }, {});
  UserProducts.associate = function(models) {
    UserProducts.belongsTo(models.User, {foreign_key: 'user_id'})
    UserProducts.belongsTo(models.Product, {foreign_key: 'product_id'})
    // associations can be defined here
  };
  return UserProducts;
};

export { createUserProducts }
