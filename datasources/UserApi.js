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

}
