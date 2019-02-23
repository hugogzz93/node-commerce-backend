import { DataSource } from 'apollo-datasource'

export default class UserAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  query() {
    return this.store.User.query()
  }

  create(input) {
    return this.store.User.query().insert(input)
  }

  createUserProductItem(input) {
    return this.store.UserProduct.query().insert(input)
  }

  async updateLastMessageSeen({user_id, issue_id, issue_message_id}) {
    const user = await this.store.User.query().where({id: user_id}).first()
    user.updateLastSeenMessage({issue_id, issue_message_id})
  }
}
