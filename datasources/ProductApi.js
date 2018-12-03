import { DataSource } from 'apollo-datasource'

export default class ProductAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store
  }

  initialize(config) {
    this.context = config.context;
  }

  async getAllProducts(query = {}) {
    return await this.store.Product.findAll({
      ...query,
      include: [{
        model: this.store.models.User,
        as: 'users'
      }]
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
