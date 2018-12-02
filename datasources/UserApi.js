import { DataSource } from 'apollo-datasource'

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

  async getAllUsers(query = {}) {
    return await this.store.User.findAll(query)
  }

  async createUser(userInput) {
    return await this.store.User.create(userInput)
  }

  async findOrCreateUser({ email: emailArg } = {}) {
    const email =
      this.context && this.context.user ? this.context.user.email : emailArg;
    if (!email || !isEmail.validate(email)) return null;

    const users = await this.store.User.findOrCreate({ where: { email } });
    return users && users[0] ? users[0] : null;
  }


}
