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

  

  runQuery() {
    const {queryMethod, query} = this
    this.cleanQueryData()
    console.log('@@@@@@@', query)
    return queryMethod({where: {}})
  }

  cleanQueryData() {
    this.query = null
    this.queryMethod = null
  }

  include(options) {
    this.query.include = this.query.include || []
    if(options.users) {
      console.log('test')
      this.query.include.push({
        required: false,
        model: this.store.models.User,
        as: 'users',
        where: options.user
      })
    }
    return this
  }

  like(rawQuery) {
    this.query =  {
      where: new QueryBuilder(rawQuery).iLike()
    }
    this.queryMethod = this.store.Product.findAll
    return this
  }

  where(productQuery) {
    this.query = {
      where: new QueryBuilder(productQuery).Or()
    }
    this.queryMethod = this.store.Product.findAll
    return this
  }

  createProduct(productInput) {
    return this.store.Product.create(productInput)
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
