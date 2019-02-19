import { DataSource } from 'apollo-datasource'
import { transaction } from 'objection'

export default class OrderAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  query() {
    return this.store.Order.query()
  }

  createOrderGroup(input) {
    return transaction(this.store.OrderGroup.knex(), trx => (
      this.store.OrderGroup.query(trx).insertGraph(input).context({trx})
    ))
  }
}
