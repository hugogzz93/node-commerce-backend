import { DataSource } from 'apollo-datasource'
import { Op } from 'sequelize'
import QueryBuilder from '../lib/QueryBuilder'

export default class ProductAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store
  }

  initialize(config) {
    this.context = config.context;
  }

  async like({name, id, userQuery} = {}) {
    const query = new QueryBuilder({name, id}).iLike()
    userQuery = new QueryBuilder(userQuery).iLike()
    return await this.store.Product.findAll({
      where: query,
      include: [{
        required: false,
        model: this.store.models.User,
        as: 'users',
        where: userQuery
      }]
    })
  }

  async where(productQuery) {
    return await this.store.Product.findAll({
      where: {
        [Op.or]: productQuery
      }
    })
  }

  async createProduct(productInput) {
    return await this.store.Product.create(productInput)
  }
  
  async findOrCreateProduct({ id: idArg } = {}) {
    const id = 
      this.context && this.context.product ? this.context.product.id : idArg;
    if(!id)
      return null

    const products = await this.store.Product.findOrCreate({ where: { id }});
    return products && products[0] ? products[0] : null;
  }
}
