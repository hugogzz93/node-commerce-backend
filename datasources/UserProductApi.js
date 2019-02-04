import { DataSource } from 'apollo-datasource'

export default class UserProductAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  query() {
    return this.store.UserProduct.query()
  }

  create(input) {
    return this.store.UserProduct.query().insert(input)
  }
}
