import { DataSource } from 'apollo-datasource'

export default class ProductAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store
  }

  initialize(config) {
    this.context = config.context;
  }

  query() {
    return this.store.Product.query()
  }

  create(input) {
    return this.store.Product.query().insert(input)
  }
}
