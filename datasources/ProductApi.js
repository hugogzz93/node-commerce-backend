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
    const products =  await this.store.product.findAll(query)
    console.log(products)
    return products
  }

  async createProduct(productInput) {
    return await this.store.product.create(productInput)
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
