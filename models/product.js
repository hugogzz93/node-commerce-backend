import sequelize from 'sequelize'

const createProduct = (connection, sequelize) => {
  const Product = connection.define('Product', {
    name: sequelize.STRING,
    description: sequelize.STRING
  }, {});


  Product.associate = function({ User }) {
    // associations can be defined here
  };

  return Product

}
export { createProduct }