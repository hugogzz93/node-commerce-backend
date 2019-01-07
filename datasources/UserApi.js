import { DataSource } from 'apollo-datasource'
import { Op } from 'sequelize'
import bcrypt from 'bcrypt'
import QueryBuilder from '../lib/QueryBuilder'

const saltRounds = 10;

export default class UserAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  async find(query) {
    return await this.store.User.findOne({ where: query })
  }

  async where(raw_query) {
    const query = new QueryBuilder(raw_query).iLike()
    return await this.store.User.findAll({
      where: query,
      include: [{
        model: this.store.models.Product,
        as: 'products'
      }]
    })
  }

  async createUser(userInput) {
    return await this.store.User.create(userInput)
  }

  async updateUser(query, input, viewer) {
    return await this
      .find(query)
      .then(async users => users
        .map(async user => { 
          if(!user.allowsModificationsFrom(viewer)) return null
          return await user.update(input)
        }
      )) 
  }
}
