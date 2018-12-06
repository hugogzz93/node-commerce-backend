import { DataSource } from 'apollo-datasource'
import { Op } from 'sequelize'

export default class ProductAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store
  }

  initialize(config) {
    this.context = config.context;
  }

  async getAllProducts({name, id, userQuery} = {}) {
    return await this.store.Product.findAll({
      where: {
        ...name ? {name: { [Op.iLike]: `%${name}%` }} : {},
        ...id ? {id} : {}
      },
      include: [{
        required: false,
        model: this.store.models.User,
        as: 'users',
        where: {
          ...userQuery ?
              {
                ...userQuery.name ? { name: { [Op.iLike]: `%${userQuery.name}%` } } : {}
              } : {}
        }
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
