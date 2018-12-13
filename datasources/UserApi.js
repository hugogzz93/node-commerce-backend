import { DataSource } from 'apollo-datasource'
import { Op } from 'sequelize'
import bcrypt from 'bcrypt'

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

  async find({name, id,  email}) {
    return await this.store.User.findOne({
      where: {
        ...id ? {id} : {},
        ...name ? {name} : {},
        ...email ? {email} : {},
      }
    })
  }

  async where({name, id, email, } = {}) {
    return await this.store.User.findAll({
      where: {
        ...name ? {name: { [Op.iLike]: `%${name}%` }} : {},
        ...email ? {email: { [Op.iLike]: `%${email}%` }} : {},
        ...id ? {id} : {}
      },
      include: [{
        model: this.store.models.Product,
        as: 'products'
      }]
    })
  }

  async createUser(userInput) {
    return await this.store.User.create(userInput)
  }

  async updateUsers(query, input) {
    return await this
      .where(query)
      .then(async users => users
        .map(async user => { 
          if(input.password) {
            input.salt = await  bcrypt.genSalt(saltRounds)
            input.password = await bcrypt.hash(input.password, input.salt)
          }
          return await user.update(input)
        }
      )) 
  }
}
